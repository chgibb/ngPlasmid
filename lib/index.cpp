#ifdef PROFILE_NGPLASMID
    #include <iostream>
    #include <algorithm>
    #include <fstream>
    #include <cstring>
    #include <unistd.h>
    std::ofstream profOut("prof.out",std::ios::out);
    void profileOut(const char*szText)
    {
        ::profOut<<szText;
    }
    #define USE_PROFILER 1
    #define LIB_PROFILER_IMPLEMENTATION
    #define LIB_PROFILER_PRINTF profileOut
    #include "../libProfiler/libProfiler.h"
#endif

#include <nan.h>

namespace ngPlasmid
{
    namespace JSAware
    {
        ::v8::Local<::v8::String> interpolateAttributes;
        ::v8::Local<::v8::String> markers;
        ::v8::Local<::v8::String> radius;
        ::v8::Local<::v8::String> inner;
        ::v8::Local<::v8::String> arrowstartwidth;
        ::v8::Local<::v8::String> arrowstartlength;
        ::v8::Local<::v8::String> arrowstartangle;
        ::v8::Local<::v8::String> arrowendwidth;
        ::v8::Local<::v8::String> arrowendlength;
        ::v8::Local<::v8::String> arrowendangle;
        ::v8::Local<::v8::String> center;
        ::v8::Local<::v8::String> x;
        ::v8::Local<::v8::String> y;
        ::v8::Local<::v8::String> width;
        ::v8::Local<::v8::String> _batchedSVGPath;
    }
}

#include "pathComplexArc.hpp"
#include "pathDonut.hpp"
#include "getPath.hpp"
#include "getAngle.hpp"

void Init(::v8::Local<::v8::Object>);

namespace ngPlasmid
{
    namespace JSExport
    {
        void batchGenerateSVGPaths(const ::Nan::FunctionCallbackInfo<::v8::Value>&);
        void batchGenerateSVGPaths(const ::Nan::FunctionCallbackInfo<::v8::Value>&args)
        {
            ::ngPlasmid::JSAware::interpolateAttributes = ::Nan::New("interpolateAttributes").ToLocalChecked();
            ::ngPlasmid::JSAware::_batchedSVGPath = ::Nan::New("_batchedSVGPath").ToLocalChecked();

            ::ngPlasmid::JSAware::radius = ::Nan::New("radius").ToLocalChecked();

            ::ngPlasmid::JSAware::center = ::Nan::New("center").ToLocalChecked();
            ::ngPlasmid::JSAware::x = ::Nan::New("x").ToLocalChecked();
            ::ngPlasmid::JSAware::y = ::Nan::New("y").ToLocalChecked();
            ::ngPlasmid::JSAware::width = ::Nan::New("width").ToLocalChecked();
            ::ngPlasmid::JSAware::inner = ::Nan::New("inner").ToLocalChecked();
            ::ngPlasmid::JSAware::width = ::Nan::New("width").ToLocalChecked();
            ::ngPlasmid::JSAware::arrowstartwidth = ::Nan::New("arrowstartwidth").ToLocalChecked();
            ::ngPlasmid::JSAware::arrowstartlength = ::Nan::New("arrowstartlength").ToLocalChecked();
            ::ngPlasmid::JSAware::arrowstartangle = ::Nan::New("arrowstartangle").ToLocalChecked();
            ::ngPlasmid::JSAware::arrowendwidth = ::Nan::New("arrowendwidth").ToLocalChecked();
            ::ngPlasmid::JSAware::arrowendlength = ::Nan::New("arrowendlength").ToLocalChecked();
            ::ngPlasmid::JSAware::arrowendangle = ::Nan::New("arrowendangle").ToLocalChecked();

            #ifdef PROFILE_NGPLASMID
                PROFILER_ENABLE;
                PROFILER_START(batchGenerateSVGPaths);
            #endif
            
            ::v8::Isolate*isolate = args.GetIsolate();

            #ifdef PROFILE_NGPLASMID
                PROFILER_START(get#plasmid);
            #endif
            ::v8::Handle<::v8::Object> plasmid = ::v8::Handle<::v8::Object>::Cast(args[0]);
            #ifdef PROFILE_NGPLASMID
                PROFILER_END();
            #endif

            ::ngPlasmid::Point center;

            ::v8::Handle<::v8::Object> centerProp = ::v8::Handle<::v8::Object>::Cast(
                ::Nan::Get(
                    plasmid,
                    ::Nan::New("center").ToLocalChecked()
                ).ToLocalChecked()
            );

            center.x = ::Nan::Get(
                centerProp,
                ::Nan::New("x").ToLocalChecked()
            ).ToLocalChecked()->NumberValue();

            center.y = ::Nan::Get(
                centerProp,
                ::Nan::New("y").ToLocalChecked()
            ).ToLocalChecked()->NumberValue();


            long double seqLength = ::Nan::Get(
                plasmid,
                ::Nan::New("sequencelength").ToLocalChecked()
            ).ToLocalChecked()->NumberValue();

            #ifdef PROFILE_NGPLASMID
                PROFILER_START(get#plasmid#tracks);
            #endif
            ::v8::Handle<::v8::Array> tracks = ::v8::Handle<::v8::Array>::Cast(
                plasmid->Get(
                    ::v8::String::NewFromUtf8(isolate,"tracks")
                )
            );
            #ifdef PROFILE_NGPLASMID
                PROFILER_END();
            #endif

            int tracksLength = tracks->Length();
            for(int i = 0; i != tracksLength; ++i)
            {
                #ifdef PROFILE_NGPLASMID
                    PROFILER_START(get#plasmid#tracks[]);
                #endif
                ::v8::Handle<::v8::Object> track = ::v8::Handle<::v8::Object>::Cast(tracks->Get(i));
                #ifdef PROFILE_NGPLASMID
                    PROFILER_END();
                #endif

                #ifdef PROFILE_NGPLASMID
                    PROFILER_START(get#plasmid#tracks[]#interpolateAttributes);
                #endif
                ::v8::Handle<::v8::Function> trackInterpolateAttributes = ::v8::Local<::v8::Function>::Cast(
                    ::Nan::Get(
                        track,
                        ::ngPlasmid::JSAware::interpolateAttributes
                    ).ToLocalChecked()
                );
                #ifdef PROFILE_NGPLASMID
                    PROFILER_END();
                #endif

                #ifdef PROFILE_NGPLASMID
                    PROFILER_START(get#plasmid#tracks[]#interpolateAttributes());
                #endif
                trackInterpolateAttributes->Call(track,0,NULL);
                #ifdef PROFILE_NGPLASMID
                    PROFILER_END();
                #endif
                

                ::ngPlasmid::JSAware::pathDonut(track);

                #ifdef PROFILE_NGPLASMID
                    PROFILER_START(get#plasmid#tracks[]#markers);
                #endif
                ::v8::Handle<::v8::Array> markers = ::v8::Handle<::v8::Array>::Cast(
                    ::Nan::Get(
                        track,
                        ::Nan::New("markers").ToLocalChecked()
                    ).ToLocalChecked()
                );
                #ifdef PROFILE_NGPLASMID
                    PROFILER_END();
                #endif

                int markersLength = markers->Length();
                for(int k = 0; k != markersLength; ++k)
                {
                    #ifdef PROFILE_NGPLASMID
                        PROFILER_START(get#plasmid#tracks[]#markers[]);
                    #endif
                    ::v8::Handle<::v8::Object> marker = ::v8::Handle<::v8::Object>::Cast(markers->Get(k));
                    #ifdef PROFILE_NGPLASMID
                        PROFILER_END();
                    #endif
                    
                    #ifdef PROFILE_NGPLASMID
                        PROFILER_START(get#plasmid#tracks[]#markers[]#interpolateAttributes);
                    #endif
                    ::v8::Handle<::v8::Function> trackMarkerInterpolateAttributes = ::v8::Local<::v8::Function>::Cast(
                        ::Nan::Get(
                            marker,
                            ::ngPlasmid::JSAware::interpolateAttributes
                        ).ToLocalChecked()
                    );
                    #ifdef PROFILE_NGPLASMID
                        PROFILER_END();
                    #endif

                    #ifdef PROFILE_NGPLASMID
                        PROFILER_START(get#plasmid#tracks[]#markers#interpolateAttributes());
                    #endif
                        trackMarkerInterpolateAttributes->Call(marker,0,NULL);
                    #ifdef PROFILE_NGPLASMID
                        PROFILER_END();
                    #endif

                    ::ngPlasmid::JSAware::getPath(
                        marker,
                        ::ngPlasmid::JSAware::getAngle(marker,seqLength),
                        center
                    );
                }
            }
            #ifdef PROFILE_NGPLASMID
                PROFILER_END();
                ::LogProfiler();
                PROFILER_DISABLE;
            #endif
        }
    }
}

void Init(::v8::Local<::v8::Object> exports) {
    exports->Set(
        ::Nan::New("batchGenerateSVGPaths").ToLocalChecked(),
        ::Nan::New<::v8::FunctionTemplate>(::ngPlasmid::JSExport::batchGenerateSVGPaths)->GetFunction()
    );
}

NODE_MODULE(ngPlasmid, Init)