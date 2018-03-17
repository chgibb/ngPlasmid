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
        void getPath(const ::v8::Handle<::v8::Object>&,::ngPlasmid::Angle,::ngPlasmid::Point&,long double);
        void getPath(const ::v8::Handle<::v8::Object>&marker,::ngPlasmid::Angle angle,::ngPlasmid::Point&center,long double trackRadius)
        {
            #ifdef PROFILE_NGPLASMID
                PROFILER_START(JSAware::getPath);
            #endif

            #ifdef PROFILE_NGPLASMID
                PROFILER_START(marker#_vadjust);
            #endif
            long double vadjust = ::Nan::Get(
                marker,
                ::ngPlasmid::JSAware::_vadjust
            ).ToLocalChecked()->NumberValue();
            #ifdef PROFILE_NGPLASMID
                PROFILER_END();
            #endif

            long double radiusInner = trackRadius + vadjust;

            #ifdef PROFILE_NGPLASMID
                PROFILER_START(marker#width);
            #endif
            long double width = ::Nan::Get(
                marker,
                ::ngPlasmid::JSAware::width
            ).ToLocalChecked()->NumberValue();
            #ifdef PROFILE_NGPLASMID
                PROFILER_END();
            #endif

            #ifdef PROFILE_NGPLASMID
                PROFILER_START(marker#arrowstartwidth);
            #endif
            long double arrowStartWidth = ::Nan::Get(
                marker,
                ::ngPlasmid::JSAware::arrowstartwidth
            ).ToLocalChecked()->NumberValue();
            #ifdef PROFILE_NGPLASMID
                PROFILER_END();
            #endif

            #ifdef PROFILE_NGPLASMID
                PROFILER_START(marker#arrowstartlength);
            #endif
            long double arrowStartLength = ::Nan::Get(
                marker,
                ::ngPlasmid::JSAware::arrowstartlength
            ).ToLocalChecked()->NumberValue();
            #ifdef PROFILE_NGPLASMID
                PROFILER_END();
            #endif

             #ifdef PROFILE_NGPLASMID
                PROFILER_START(marker#arrowstartangle);
            #endif
            long double arrowStartAngle = ::Nan::Get(
                marker,
                ::ngPlasmid::JSAware::arrowstartangle
            ).ToLocalChecked()->NumberValue();
            #ifdef PROFILE_NGPLASMID
                PROFILER_END();
            #endif

            #ifdef PROFILE_NGPLASMID
                PROFILER_START(marker#arrowendwidth);
            #endif
            long double arrowEndWidth = ::Nan::Get(
                marker,
                ::ngPlasmid::JSAware::arrowendwidth
            ).ToLocalChecked()->NumberValue();
            #ifdef PROFILE_NGPLASMID
                PROFILER_END();
            #endif

            #ifdef PROFILE_NGPLASMID
                PROFILER_START(marker#arrowendlength);
            #endif
            long double arrowEndLength = ::Nan::Get(
                marker,
                ::ngPlasmid::JSAware::arrowendlength
            ).ToLocalChecked()->NumberValue();
            #ifdef PROFILE_NGPLASMID
                PROFILER_END();
            #endif

             #ifdef PROFILE_NGPLASMID
                PROFILER_START(marker#arrowendangle);
            #endif
            long double arrowEndAngle = ::Nan::Get(
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