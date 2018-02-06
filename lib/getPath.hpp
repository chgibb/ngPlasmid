#pragma once

#include <string>

#include <nan.h>

#include "polarToCartesian.hpp"

namespace ngPlasmid
{
    namespace JSAware
    {
        void getPath(const ::v8::Handle<::v8::Object>&);
        void getPath(const ::v8::Handle<::v8::Object>&marker)
        {
            
        }
    }
}