#pragma once

#include <nan.h>

#include "angle.hpp"

namespace ngPlasmid
{
    namespace JSAware
    {
        ::ngPlasmid::Angle getAngle(const ::v8::Handle<::v8::Object>&,float);
        ::ngPlasmid::Angle getAngle(const ::v8::Handle<::v8::Object>&marker,float seqLength)
        {
            #ifdef PROFILE_NGPLASMID
                PROFILER_START(getAngle);
            #endif
            
            float startAngle;
            float endAngle;
            float end;

            #ifdef PROFILE_NGPLASMID
                PROFILER_START(get#marker#start);
            #endif
            float markerStart = ::Nan::Get(
                marker,
                ::ngPlasmid::JSAware::_start
            ).ToLocalChecked()->NumberValue();
            #ifdef PROFILE_NGPLASMID
                PROFILER_END();
            #endif

            #ifdef PROFILE_NGPLASMID
                PROFILER_START(get#marker#end);
            #endif
            float markerEnd = ::Nan::Get(
                marker,
                ::ngPlasmid::JSAware::_end
            ).ToLocalChecked()->NumberValue();
            #ifdef PROFILE_NGPLASMID
                PROFILER_END();
            #endif
            
            #ifdef PROFILE_NGPLASMID
                PROFILER_START(getAngleMath);
            #endif
            startAngle = (markerStart / seqLength) * 360;
            end = markerEnd || markerStart;

            endAngle = ((end ? end : 0) / seqLength) * 360;
            endAngle = endAngle + ((endAngle < startAngle) ? 360 : 0);

            ::ngPlasmid::Angle res;
            res.start = startAngle;
            res.end = endAngle;
            #ifdef PROFILE_NGPLASMID
                PROFILER_END();
            #endif
            
            #ifdef PROFILE_NGPLASMID
                PROFILER_END();
            #endif
            return res;
        }
    }
}