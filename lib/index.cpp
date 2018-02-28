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
                        ::Nan::New("interpolateAttributes").ToLocalChecked()
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
                            ::Nan::New("interpolateAttributes").ToLocalChecked()
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