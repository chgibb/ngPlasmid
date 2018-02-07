
#ifdef PROFILE_NGPLASMID
    #include <iostream>
    #include <algorithm>
    #include <fstream>
    #include <cstring>
    #include <unistd.h>
    std::ofstream profOut("prof.out",std::ios::out);
    void profileOut(const char *szText)
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

            ::v8::Handle<::v8::Object> plasmid = ::v8::Handle<::v8::Object>::Cast(args[0]);

            ::v8::Handle<::v8::Array> tracks = ::v8::Handle<::v8::Array>::Cast(
                plasmid->Get(
                    ::v8::String::NewFromUtf8(isolate,"tracks")
                )
            );

            int tracksLength = tracks->Length();
            for(int i = 0; i != tracksLength; ++i)
            {
                ::v8::Handle<::v8::Object> track = ::v8::Handle<::v8::Object>::Cast(tracks->Get(i));
                ::ngPlasmid::JSAware::pathDonut(track);

                ::v8::Handle<::v8::Array> markers = ::v8::Handle<::v8::Array>::Cast(
                    ::Nan::Get(
                        track,
                        ::Nan::New("markers").ToLocalChecked()
                    ).ToLocalChecked()
                );

                int markersLength = markers->Length();
                for(int k = 0; k != markersLength; ++k)
                {
                    ::v8::Handle<::v8::Object> marker = ::v8::Handle<::v8::Object>::Cast(markers->Get(k));
                    ::ngPlasmid::JSAware::getPath(marker);
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