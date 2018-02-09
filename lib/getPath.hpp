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
        void getPath(const ::v8::Handle<::v8::Object>&,::ngPlasmid::Angle,::ngPlasmid::Point&);
        void getPath(const ::v8::Handle<::v8::Object>&marker,::ngPlasmid::Angle angle,::ngPlasmid::Point&center)
        {
            #ifdef PROFILE_NGPLASMID
                PROFILER_START(JSAware::getPath);
            #endif

            #ifdef PROFILE_NGPLASMID
                PROFILER_START(marker#radius);
            #endif
            ::v8::Handle<::v8::Object> radius = ::v8::Handle<::v8::Object>::Cast(
                ::Nan::Get(
                    marker,
                    ::Nan::New("radius").ToLocalChecked()
                ).ToLocalChecked()
            );
            #ifdef PROFILE_NGPLASMID
                PROFILER_END();
            #endif

            #ifdef PROFILE_NGPLASMID
                PROFILER_START(marker#radius#inner);
            #endif
            long double radiusInner = ::Nan::Get(
                radius,
                ::Nan::New("inner").ToLocalChecked()
            ).ToLocalChecked()->NumberValue();
            #ifdef PROFILE_NGPLASMID
                PROFILER_END();
            #endif

            #ifdef PROFILE_NGPLASMID
                PROFILER_START(marker#width);
            #endif
            long double width = ::Nan::Get(
                marker,
                ::Nan::New("width").ToLocalChecked()
            ).ToLocalChecked()->NumberValue();
            #ifdef PROFILE_NGPLASMID
                PROFILER_END();
            #endif

            #ifdef PROFILE_NGPLASMID
                PROFILER_START(marker#arrowstart);
            #endif
            ::v8::Handle<::v8::Object> arrowStart = ::v8::Handle<::v8::Object>::Cast(
                ::Nan::Get(
                    marker,
                    ::Nan::New("arrowstart").ToLocalChecked()
                ).ToLocalChecked()
            );
            #ifdef PROFILE_NGPLASMID
                PROFILER_END();
            #endif

            #ifdef PROFILE_NGPLASMID
                PROFILER_START(marker#arrowstart#width);
            #endif
            long double arrowStartWidth = ::Nan::Get(
                arrowStart,
                ::Nan::New("width").ToLocalChecked()
            ).ToLocalChecked()->NumberValue();
            #ifdef PROFILE_NGPLASMID
                PROFILER_END();
            #endif

            #ifdef PROFILE_NGPLASMID
                PROFILER_START(marker#arrowstart#length);
            #endif
            long double arrowStartLength = ::Nan::Get(
                arrowStart,
                ::Nan::New("length").ToLocalChecked()
            ).ToLocalChecked()->NumberValue();
            #ifdef PROFILE_NGPLASMID
                PROFILER_END();
            #endif

            #ifdef PROFILE_NGPLASMID
                PROFILER_START(marker#arrowstart#angle);
            #endif
            long double arrowStartAngle = ::Nan::Get(
                arrowStart,
                ::Nan::New("angle").ToLocalChecked()
            ).ToLocalChecked()->NumberValue();
            #ifdef PROFILE_NGPLASMID
                PROFILER_END();
            #endif

            #ifdef PROFILE_NGPLASMID
                PROFILER_START(marker#arrowend);
            #endif
             ::v8::Handle<::v8::Object> arrowEnd = ::v8::Handle<::v8::Object>::Cast(
                ::Nan::Get(
                    marker,
                    ::Nan::New("arrowend").ToLocalChecked()
                ).ToLocalChecked()
            );
            #ifdef PROFILE_NGPLASMID
                PROFILER_END();
            #endif

            #ifdef PROFILE_NGPLASMID
                PROFILER_START(makrer#arrowend#width);
            #endif
            long double arrowEndWidth = ::Nan::Get(
                arrowEnd,
                ::Nan::New("width").ToLocalChecked()
            ).ToLocalChecked()->NumberValue();
            #ifdef PROFILE_NGPLASMID
                PROFILER_END();
            #endif

            #ifdef PROFILE_NGPLASMID
                PROFILER_START(marker#arrowend#length);
            #endif
            long double arrowEndLength = ::Nan::Get(
                arrowEnd,
                ::Nan::New("length").ToLocalChecked()
            ).ToLocalChecked()->NumberValue();
            #ifdef PROFILE_NGPLASMID
                PROFILER_END();
            #endif

            #ifdef PROFILE_NGPLASMID
                PROFILER_START(marker#arrowend#angle);
            #endif
            long double arrowEndAngle = ::Nan::Get(
                arrowEnd,
                ::Nan::New("angle").ToLocalChecked()
            ).ToLocalChecked()->NumberValue();
            #ifdef PROFILE_NGPLASMID
                PROFILER_END();
            #endif

            ::Nan::Set(
                marker,
                ::Nan::New("_batchedSVGPath").ToLocalChecked(),
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