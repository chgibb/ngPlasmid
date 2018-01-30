#include <nan.h>
#include "pathComplexArc.hpp"

void Init(v8::Local<v8::Object> exports) {
  exports->Set(
    Nan::New("pathComplexArc").ToLocalChecked(),
    Nan::New<v8::FunctionTemplate>(ngPlasmid::JSExport::pathComplexArc)->GetFunction()
  );
}

NODE_MODULE(ngPlasmid, Init)