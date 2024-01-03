#!/bin/bash

# Command Line parameters
src="$1"            # Source code file path
input="$2"          # Input file path
output="$3"         # Output file path
result="$4"         # Result of the execution (WA, MLE, CE, AC)
language="$5"       # Programming language (e.g., cpp, java, py)
timeLimit="$6"      # Time limit in seconds
memoryLimit="$7"    # Memory limit in kilobytes

echo "" > "$output"
echo "" > "$result"

check_compile_errors() {
    if [ $? -ne 0 ]; then
        echo "Message: Compilation Error" > "$result"
        exit 1
    fi
}

check_runtime_errors() {
    exit_status=$?
    if [ $exit_status -ne 0 ]; then
        timeTaken=$(grep -o 'Time: [0-9.]*' "$result" | awk '{print $2}')
        memoryUsed=$(grep -o 'Memory: [0-9]*' "$result" | awk '{print $2}')

        echo "Time: $timeTaken" > "$result"
        echo "Memory: $memoryUsed" >> "$result"

        if [ $exit_status -eq 139 ]; then
            echo "Info: Segmentation fault (core dumped)" >> "$result"
        elif [ $exit_status -eq 124 ]; then
            echo "Message: Time Limit Exceeded (TLE)" >> "$result"
            exit 1
        fi
        echo "Message: Runtime Error" >> "$result"
        exit 1
    fi
}

cleanup() {
    rm -f solution *.class
}
trap cleanup EXIT

cleanup

if [ "$language" = "cpp" ]; then
    g++ "$src" -o solution &> "$output"
    check_compile_errors
    /usr/bin/time -f "Time: %e\nMemory: %M" -o "$result" timeout "$timeLimit"s ./solution < "$input" > "$output" 2>&1
    check_runtime_errors
elif [ "$language" = "javascript" ]; then
    /usr/bin/time -f "Time: %e\nMemory: %M" -o "$result" timeout "$timeLimit"s node "$src" < "$input" > "$output" 2>&1
    check_runtime_errors
elif [ "$language" = "java" ]; then
    javac "$src" -d . &> "$output" 2>&1
    check_compile_errors
    main_class=$(javap -public -classpath . "$(basename "$src" .java)" | grep 'public class' | awk '{print $3}' | sed 's/{//')
    /usr/bin/time -f "Time: %e\nMemory: %M" -o "$result" timeout "$timeLimit"s java -cp . "$main_class" < "$input" > "$output" 2>&1
    check_runtime_errors
else
    echo "Error: Unsupported language: $language" > "$result"
    exit 1
fi

timeTaken=$(grep -o 'Time: [0-9.]*' "$result" | awk '{print $2}')
memoryUsed=$(grep -o 'Memory: [0-9]*' "$result" | awk '{print $2}')

echo "Time: $timeTaken" > "$result"
echo "Memory: $memoryUsed" >> "$result"

actualMemory=$((memoryUsed - memoryLimit))
if ((actualMemory > 0)); then
    echo "Message: Memory Limit Exceeded (MLE)" >> "$result"
    exit 1
fi

echo "Message: Executed" >> "$result"
