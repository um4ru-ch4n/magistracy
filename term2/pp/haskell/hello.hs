main = do
  putStrLn "Hello, everybody!"
  putStrLn ("Please look at my favorite odd numbers: " ++ show (nub [1, 2, 3, 3, 2, 1]))

add a b c = a + b + c

fib x
  | x < 2 = 1
  | otherwise = fib (x - 1) + fib (x - 2)

hz x
  | x < 3 = "like"
  | x >= 3 && x < 5 = "not like"
  | otherwise = "dislike"

myMap func [] = []
myMap func (x:xs) = func x:(myMap func xs)

foo = (4*) . ((10+) . (100+))

fun x = x
twoArgs x y = x+y

-- distance :: Point -> Point -> Float
-- distance (Point x y) (Point x' y') = sqrt $ dx + dy
--     where dx = (x - x') ** 2
--           dy = (y - y') ** 2

contains :: (Eq t) => t -> [t] -> Bool
contains _ [] = False
contains num (x:xs) = (num == x) || (contains num xs)

nub :: (Eq t) => [t] -> [t]
nub [] = []
nub (x:xs)
  | contains x xs = nub xs
  | otherwise = x : nub xs