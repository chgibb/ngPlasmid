#include <nan.h>
#include "pathComplexArc.hpp"

void Init(v8::Local<v8::Object> exports) {
  /*exports->Set(
    Nan::New("polarToCartesian").ToLocalChecked(),
    Nan::New<v8::FunctionTemplate>(ngPlasmid::polarToCartesian)->GetFunction()
  );*/
}

NODE_MODULE(hello, Init)