#pragma once

#include <future>
#include <thread>
#include <utility>

namespace ngPlasmid
{
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
}
