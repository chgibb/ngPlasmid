#pragma once

namespace ngPlasmid
{
    template <class Container>
    void split(Container*in,Container*&l,Container*&r)
    {
        #ifdef PROFILE_NGPLASMID
            PROFILER_START(split);
        #endif

        size_t middle = in->size()/2;

        l = new Container(in->begin(),in->begin() + middle);
        r = new Container(in->begin() + middle,in->end());
    
        #ifdef PROFILE_NGPLASMID
            PROFILER_END();
        #endif
    }
}