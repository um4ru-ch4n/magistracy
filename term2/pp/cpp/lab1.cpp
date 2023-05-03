#include <iostream>
#include <mpi.h>

using namespace std;

// Функция быстрой сортировки Хоара
void quicksort(int* arr, int left, int right) {
    int i = left, j = right;
    int tmp;
    int pivot = arr[(left + right) / 2];

    while (i <= j) {
        while (arr[i] < pivot)
            i++;
        while (arr[j] > pivot)
            j--;
        if (i <= j) {
            tmp = arr[i];
            arr[i] = arr[j];
            arr[j] = tmp;
            i++;
            j--;
        }
    }

    if (left < j)
        quicksort(arr, left, j);
    if (i < right)
        quicksort(arr, i, right);
}

int main(int argc, char** argv) {
    int rank, size, N = 10;
    int* arr;

    MPI_Init(&argc, &argv);
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    // Каждый процесс создает свой сегмент массива для сортировки
    int n = N / size;
    arr = new int[n];

    // Заполнение массива случайными значениями
    srand(time(NULL) + rank);
    for (int i = 0; i < n; i++) {
        arr[i] = rand() % 100;
    }

    // Сортировка каждого сегмента массива на каждом процессе
    quicksort(arr, 0, n - 1);

    // Сбор всех сегментов массива на 0 процессе
    if (rank == 0) {
        int* result_arr = new int[N];
        int* recv_buf = new int[n];
        int offset = 0;

        // Копирование отсортированного сегмента массива на 0 процесс
        for (int i = 0; i < n; i++) {
            result_arr[i] = arr[i];
        }

        // Получение и объединение сегментов массива от других процессов
        for (int i = 1; i < size; i++) {
            MPI_Recv(recv_buf, n, MPI_INT, i, 0, MPI_COMM_WORLD, MPI_STATUS_IGNORE);
            for (int j = 0; j < n; j++) {
                result_arr[offset + j] = recv_buf[j];
            }
            
            offset += n;
        }

        // Сортировка общего массива
        quicksort(result_arr, 0, N - 1);

        // Вывод отсортированного массива
        cout << "Sorted array: ";
        for (int i = 0; i < N; i++) {
            cout << result_arr[i] << " ";
        }
        cout << endl;

        delete[] result_arr;
        delete[] recv_buf;
    }
    else {
        // Отправка отсортированного сегмента массива на 0 процесс
        MPI_Send(arr, n, MPI_INT, 0, 0, MPI_COMM_WORLD);
    }

    MPI_Finalize();
    delete[] arr;

    return 0;
}