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

            long double markerStart = ::Nan::Get(
                marker,
                ::Nan::New("start").ToLocalChecked()
            ).ToLocalChecked()->NumberValue();

            long double markerEnd = ::Nan::Get(
                marker,
                ::Nan::New("end").ToLocalChecked()
            ).ToLocalChecked()->NumberValue();
            
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