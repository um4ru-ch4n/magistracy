-module(parallel_quick_sort).
-export([quicksort/2]).

quicksort(List, SpawnFactor) when SpawnFactor > 0 ->
	Self = self(),
	Child = spawn(fun() -> quicksort(Self, List, SpawnFactor) end),
	receive
		{Child, SortedList} -> SortedList
	end.

quicksort(_, [], 0) ->
	[];

quicksort(Parent, [], _) ->
	Parent ! {self(), []};

quicksort(Parent, [Pivot|Tail], 0) ->
	{Greater, LessOrEqual} = partition(Pivot, Tail),
	quicksort(Parent, LessOrEqual, 0) ++ [Pivot | quicksort(Parent, Greater, 0)];

quicksort(Parent, [Pivot|Tail], 1) ->
	{Greater, LessOrEqual} = partition(Pivot, Tail),
	Parent ! {self(),
		quicksort(Parent, LessOrEqual, 0) ++
		[Pivot | quicksort(Parent, Greater, 0)]};

quicksort(Parent, [Pivot|Tail], SpawnFactor) ->
	{Greater, LessOrEqual} = partition(Pivot, Tail),
	Self = self(),
	LPid = spawn(fun() -> quicksort(Self, LessOrEqual, SpawnFactor-1) end),
	GPid = spawn(fun() -> quicksort(Self, Greater, SpawnFactor-1) end),
	receive
		{LPid, LResult} ->
			receive
				{GPid, GResult} ->
					Parent ! {Self, LResult ++ [Pivot | GResult]}
			end
	end.

partition(Pivot, List) ->
	partition(Pivot, List, [], []).

partition(_, [], Greater, LessOrEqual) -> {Greater, LessOrEqual};

partition(Pivot, [H|T], Greater, LessOrEqual) when H > Pivot ->
	partition(Pivot, T, [H|Greater], LessOrEqual);

partition(Pivot, [H|T], Greater, LessOrEqual) ->
	partition(Pivot, T, Greater, [H|LessOrEqual]).