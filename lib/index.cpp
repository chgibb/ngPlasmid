#include <nan.h>
#include "pathComplexArc.hpp"

namespace ngPlasmid
{
  namespace JSExport
  {
    void batchGenerateSVGPaths(const Nan::FunctionCallbackInfo<v8::Value>&args)
    {

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