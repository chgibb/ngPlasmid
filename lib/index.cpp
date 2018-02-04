#include <nan.h>
#include "pathComplexArc.hpp"

namespace ngPlasmid
{    
  namespace JSExport
  {
    void batchGenerateSVGPaths(const Nan::FunctionCallbackInfo<v8::Value>&args)
    {
      v8::Isolate*isolate = args.GetIsolate();

      v8::Handle<v8::Object> plasmid = v8::Handle<v8::Object>::Cast(args[0]);

      v8::Handle<v8::Array> tracks = v8::Handle<v8::Array>::Cast(
        plasmid->Get(
          v8::String::NewFromUtf8(isolate,"tracks")
        )
      );
      int length = tracks->Length();
      for(int i = 0; i != length; ++i)
      {
        
      }
    }
  }
}

void Init(v8::Local<v8::Object> exports) {
  exports->Set(
    Nan::New("batchGenerateSVGPaths").ToLocalChecked(),
    Nan::New<v8::FunctionTemplate>(ngPlasmid::JSExport::batchGenerateSVGPaths)->GetFunction()
  );
}

NODE_MODULE(ngPlasmid, Init)