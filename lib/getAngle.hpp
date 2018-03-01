#pragma once

#include <nan.h>

#include "angle.hpp"

namespace ngPlasmid
{
    namespace JSAware
    {
        ::ngPlasmid::Angle getAngle(const ::v8::Handle<::v8::Object>&,long double);
        ::ngPlasmid::Angle getAngle(const ::v8::Handle<::v8::Object>&marker,long double seqLength)
        {
            #ifdef PROFILE_NGPLASMID
                PROFILER_START(getAngle);
            #endif
            
            long double startAngle;
            long double endAngle;
            long double end;

            #ifdef PROFILE_NGPLASMID
                PROFILER_START(get#marker#start);
            #endif
            long double markerStart = ::Nan::Get(
                marker,
                ::ngPlasmid::JSAware::_start
            ).ToLocalChecked()->NumberValue();
            #ifdef PROFILE_NGPLASMID
                PROFILER_END();
            #endif

            #ifdef PROFILE_NGPLASMID
                PROFILER_START(get#marker#end);
            #endif
            long double markerEnd = ::Nan::Get(
                marker,
                ::ngPlasmid::JSAware::_end
            ).ToLocalChecked()->NumberValue();
            #ifdef PROFILE_NGPLASMID
                PROFILER_END();
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
            return res;
        }
    }
}