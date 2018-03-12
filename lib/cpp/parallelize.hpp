#pragma once

#include <future>
#include <thread>
#include <utility>

/**
 * @brief 
 * 
 * Run the function func on a new thread, passing args by reference. Returns a future for
 * func's execution. Ret is the return type of the function to launch and Args is the
 * type of each parameter to pass in the order they are passed
 * 
 * @param Ret(*func)(Args...)
 * @param Args...args
 * 
 * @return template <class Ret,class ...Args> std::future<Ret>
 */
template <class Ret,class ...Args>
std::future<Ret> launchParallelRef(Ret(*func)(Args...),Args...args)
{
    #ifdef PROFILE_NGPLASMID
        PROFILER_START(launchParallelRef);
    #endif

    std::future<Ret> res;
    std::packaged_task<Ret(Args...)> task(func);
    res = task.get_future();
    std::thread(
        std::move(task),
        std::ref(args)...
    ).detach();

    #ifdef PROFILE_NGPLASMID
        PROFILER_END();
    #endif
    return res;
}

/**
 * @brief 
 * 
 * Run the function func on a new thread, passing args. Returns a future for
 * func's execution. Ret is the return type of the function to launch and Args is the
 * type of each parameter to pass in the order they are passed
 * 
 * @param Ret(*func)(Args...)
 * @param Args...args
 * 
 * @return template <class Ret,class ...Args> std::future<Ret>
 */
template <class Ret,class ...Args>
std::future<Ret> launchParallel(Ret(*func)(Args...),Args...args)
{
    std::future<Ret> res;
    std::packaged_task<Ret(Args...)> task(func);
    res = task.get_future();
    std::thread(
        std::move(task),
        args...
    ).detach();
    return res;
}