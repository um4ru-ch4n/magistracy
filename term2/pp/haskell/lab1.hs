import Control.Parallel
import Control.Parallel.Strategies
import Data.Time
import Data.List
import System.Random

randomlist :: Int -> StdGen -> [Int]
randomlist n = take n . unfoldr (Just . randomR(1,1000))

qSort :: [Int] -> [Int]
qSort []      = []
qSort [x]     = [x]
qSort (x:xs)  = (seq (par low high) (low ++ (x:high)))
    where
        low = qSort [y|y <-xs, y < x] 
        high = qSort [y|y <-xs, y >= x]

solve :: Int -> [Int] -> [Int]
solve n [] = []
solve n xs = result
    where
    result = (seq (par cs bs) (merge bs cs))
        where
            (ds, es) = splitAt n xs
            bs = qSort ds
            cs = solve n es

merge :: [Int] -> [Int] -> [Int]
merge [] [] = []
merge [] xs = xs
merge xs [] = xs
merge (x:xt) (y:yt) | x <= y = x : merge xt (y:yt)
                    | otherwise = y : merge (x:xt) yt

main = do
    start <- getCurrentTime
    seed  <- newStdGen
    let n = 1000000
    let k = quot n 100
    let rs = randomlist n seed
    let prt = solve k rs
    print prt
    stop <- getCurrentTime
    print (diffUTCTime stop start)