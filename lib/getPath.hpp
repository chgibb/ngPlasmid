#pragma once

#include <string>

#include <nan.h>

#include "pathArc.hpp"

namespace ngPlasmid
{
    namespace JSAware
    {
        void getPath(const ::v8::Handle<::v8::Object>&);
        void getPath(const ::v8::Handle<::v8::Object>&marker)
        {
            #ifdef PROFILE_NGPLASMID
                PROFILER_START(get#marker#track);
            #endif
            ::v8::Handle<::v8::Object> track = ::v8::Handle<::v8::Object>::Cast(
                ::Nan::Get(
                    marker,
                    ::Nan::New("track").ToLocalChecked()
                ).ToLocalChecked()
            );
            #ifdef PROFILE_NGPLASMID
                PROFILER_END();
            #endif

            #ifdef PROFILE_NGPLASMID
                PROFILER_START(get#marker#track#center);
            #endif
            ::v8::Handle<::v8::Object> center = ::v8::Handle<::v8::Object>::Cast(
                ::Nan::Get(
                    track,
                    ::Nan::New("center").ToLocalChecked()
                ).ToLocalChecked()
            );
            #ifdef PROFILE_NGPLASMID
                PROFILER_END();
            #endif

            #ifdef PROFILE_NGPLASMID
                PROFILER_START(get#marker#track#center#x);
            #endif
            long double centerX = ::Nan::Get(
                center,
                ::Nan::New("x").ToLocalChecked()
            ).ToLocalChecked()->NumberValue();
            #ifdef PROFILE_NGPLASMID
                PROFILER_END();
            #endif

            #ifdef PROFILE_NGPLASMID
                PROFILER_START(get#marker#track#center#y);
            #endif
            long double centerY = ::Nan::Get(
                center,
                ::Nan::New("y").ToLocalChecked()
            ).ToLocalChecked()->NumberValue();
            #ifdef PROFILE_NGPLASMID
                PROFILER_END();
            #endif

            #ifdef PROFILE_NGPLASMID
                PROFILER_START(get#marker#angle);
            #endif
            ::v8::Handle<::v8::Object> angle = ::v8::Handle<::v8::Object>::Cast(
                ::Nan::Get(
                    marker,
                    ::Nan::New("angle").ToLocalChecked()
                ).ToLocalChecked()
            );
            #ifdef PROFILE_NGPLASMID
                PROFILER_END();
            #endif

            #ifdef PROFILE_NGPLASMID
                PROFILER_START(get#marker#angle#start);
            #endif
            long double angleStart = ::Nan::Get(
                angle,
                ::Nan::New("start").ToLocalChecked()
            ).ToLocalChecked()->NumberValue();
            #ifdef PROFILE_NGPLASMID
                PROFILER_END();
            #endif

            #ifdef PROFILE_NGPLASMID
                PROFILER_START(get#marker#angle#end);
            #endif
            long double angleEnd = ::Nan::Get(
                angle,
                ::Nan::New("end").ToLocalChecked()
            ).ToLocalChecked()->NumberValue();
            #ifdef PROFILE_NGPLASMID
                PROFILER_END();
            #endif

            
            ::v8::Handle<::v8::Object> radius = ::v8::Handle<::v8::Object>::Cast(
                ::Nan::Get(
                    marker,
                    ::Nan::New("radius").ToLocalChecked()
                ).ToLocalChecked()
            );

            long double radiusInner = ::Nan::Get(
                radius,
                ::Nan::New("inner").ToLocalChecked()
            ).ToLocalChecked()->NumberValue();

            long double width = ::Nan::Get(
                marker,
                ::Nan::New("width").ToLocalChecked()
            ).ToLocalChecked()->NumberValue();

            ::v8::Handle<::v8::Object> arrowStart = ::v8::Handle<::v8::Object>::Cast(
                ::Nan::Get(
                    marker,
                    ::Nan::New("arrowstart").ToLocalChecked()
                ).ToLocalChecked()
            );

            long double arrowStartWidth = ::Nan::Get(
                arrowStart,
                ::Nan::New("width").ToLocalChecked()
            ).ToLocalChecked()->NumberValue();

            long double arrowStartLength = ::Nan::Get(
                arrowStart,
                ::Nan::New("length").ToLocalChecked()
            ).ToLocalChecked()->NumberValue();

            long double arrowStartAngle = ::Nan::Get(
                arrowStart,
                ::Nan::New("angle").ToLocalChecked()
            ).ToLocalChecked()->NumberValue();

             ::v8::Handle<::v8::Object> arrowEnd = ::v8::Handle<::v8::Object>::Cast(
                ::Nan::Get(
                    marker,
                    ::Nan::New("arrowend").ToLocalChecked()
                ).ToLocalChecked()
            );

            long double arrowEndWidth = ::Nan::Get(
                arrowEnd,
                ::Nan::New("width").ToLocalChecked()
            ).ToLocalChecked()->NumberValue();

            long double arrowEndLength = ::Nan::Get(
                arrowEnd,
                ::Nan::New("length").ToLocalChecked()
            ).ToLocalChecked()->NumberValue();

            long double arrowEndAngle = ::Nan::Get(
                arrowEnd,
                ::Nan::New("angle").ToLocalChecked()
            ).ToLocalChecked()->NumberValue();

            ::Nan::Set(
                marker,
                ::Nan::New("_batchedSVGPath").ToLocalChecked(),
                ::Nan::New(
                    ::ngPlasmid::pathArc(
                        centerX,
                        centerY,
                        radiusInner,
                        angleStart,
                        angleEnd,
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
        }
    }
}