#pragma once

#include <string>

#include <nan.h>

#include "pathArc.hpp"
#include "angle.hpp"
#include "point.hpp"

namespace ngPlasmid
{
    namespace JSAware
    {
        void getPath(const ::v8::Handle<::v8::Object>&,::ngPlasmid::Angle,::ngPlasmid::Point&,float);
        void getPath(const ::v8::Handle<::v8::Object>&marker,::ngPlasmid::Angle angle,::ngPlasmid::Point&center,float trackRadius)
        {
            #ifdef PROFILE_NGPLASMID
                PROFILER_START(JSAware::getPath);
            #endif

            #ifdef PROFILE_NGPLASMID
                PROFILER_START(marker#_vadjust);
            #endif
            float vadjust = ::Nan::Get(
                marker,
                ::ngPlasmid::JSAware::_vadjust
            ).ToLocalChecked()->NumberValue();
            #ifdef PROFILE_NGPLASMID
                PROFILER_END();
            #endif

            float radiusInner = trackRadius + vadjust;

            #ifdef PROFILE_NGPLASMID
                PROFILER_START(marker#width);
            #endif
            float width = ::Nan::Get(
                marker,
                ::ngPlasmid::JSAware::width
            ).ToLocalChecked()->NumberValue();
            #ifdef PROFILE_NGPLASMID
                PROFILER_END();
            #endif

            #ifdef PROFILE_NGPLASMID
                PROFILER_START(marker#arrowstartwidth);
            #endif
            float arrowStartWidth = ::Nan::Get(
                marker,
                ::ngPlasmid::JSAware::arrowstartwidth
            ).ToLocalChecked()->NumberValue();
            #ifdef PROFILE_NGPLASMID
                PROFILER_END();
            #endif

            #ifdef PROFILE_NGPLASMID
                PROFILER_START(marker#arrowstartlength);
            #endif
            float arrowStartLength = ::Nan::Get(
                marker,
                ::ngPlasmid::JSAware::arrowstartlength
            ).ToLocalChecked()->NumberValue();
            #ifdef PROFILE_NGPLASMID
                PROFILER_END();
            #endif

             #ifdef PROFILE_NGPLASMID
                PROFILER_START(marker#arrowstartangle);
            #endif
            float arrowStartAngle = ::Nan::Get(
                marker,
                ::ngPlasmid::JSAware::arrowstartangle
            ).ToLocalChecked()->NumberValue();
            #ifdef PROFILE_NGPLASMID
                PROFILER_END();
            #endif

            #ifdef PROFILE_NGPLASMID
                PROFILER_START(marker#arrowendwidth);
            #endif
            float arrowEndWidth = ::Nan::Get(
                marker,
                ::ngPlasmid::JSAware::arrowendwidth
            ).ToLocalChecked()->NumberValue();
            #ifdef PROFILE_NGPLASMID
                PROFILER_END();
            #endif

            #ifdef PROFILE_NGPLASMID
                PROFILER_START(marker#arrowendlength);
            #endif
            float arrowEndLength = ::Nan::Get(
                marker,
                ::ngPlasmid::JSAware::arrowendlength
            ).ToLocalChecked()->NumberValue();
            #ifdef PROFILE_NGPLASMID
                PROFILER_END();
            #endif

             #ifdef PROFILE_NGPLASMID
                PROFILER_START(marker#arrowendangle);
            #endif
            float arrowEndAngle = ::Nan::Get(
                marker,
                ::ngPlasmid::JSAware::arrowendangle
            ).ToLocalChecked()->NumberValue();
            #ifdef PROFILE_NGPLASMID
                PROFILER_END();
            #endif

            ::Nan::Set(
                marker,
                ::ngPlasmid::JSAware::_batchedSVGPath,
                ::Nan::New(
                    ::ngPlasmid::pathArc(
                        center.x,
                        center.y,
                        radiusInner,
                        angle.start,
                        angle.end,
                        width,
                        arrowStartWidth,
                        arrowStartLength,
                        arrowStartAngle,
                        arrowEndWidth,
                        arrowEndLength,
                        arrowEndAngle
                    )
                ).ToLocalChecked()
            );

            #ifdef PROFILE_NGPLASMID
                PROFILER_END();
            #endif
        }
    }
}