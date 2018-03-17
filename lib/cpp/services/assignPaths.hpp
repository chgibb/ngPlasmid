#pragma once

#include <nan.h>

#include "propKeys.hpp"

namespace ngPlasmid
{
    inline void assignPaths(::v8::Handle<::v8::Array>&markers,std::vector<::ngPlasmid::TrackMarkerPack>&packs)
    {
        #ifdef PROFILE_NGPLASMID
            PROFILER_START(assignPaths);
        #endif

        auto end = packs.end();
        for(auto it = packs.begin(); it != end; ++it)
        {
            ::Nan::Set(
                ::v8::Handle<::v8::Object>::Cast(markers->Get(it->index)),
                ::ngPlasmid::JSAware::_batchedSVGPath,
                ::Nan::New(it->path).ToLocalChecked()
            );
        }

        #ifdef PROFILE_NGPLASMID
            PROFILER_END();
        #endif
    }
}