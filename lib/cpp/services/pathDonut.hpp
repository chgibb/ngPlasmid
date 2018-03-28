#pragma once

#include <string>
#include <iostream>

#include <nan.h>

#include "polarToCartesian.hpp"
#include "point.hpp"

namespace ngPlasmid
{
    inline std::string pathDonut(
        float,
        float,
        float,
        float
    );

    namespace JSAware
    {
        void pathDonut(const ::v8::Handle<::v8::Object>&,float);
        void pathDonut(const ::v8::Handle<::v8::Object>&track,float radius)
        {
            #ifdef PROFILE_NGPLASMID
                PROFILER_START(JSAware::pathDonut);
            #endif

            #ifdef PROFILE_NGPLASMID
                PROFILER_START(get#track#center);
            #endif
            ::v8::Handle<::v8::Object> center = ::v8::Handle<::v8::Object>::Cast(
                ::Nan::Get(   
                    track,
                    ::ngPlasmid::JSAware::center
                ).ToLocalChecked()
            );
            #ifdef PROFILE_NGPLASMID
                PROFILER_END();
            #endif

            ::v8::Handle<::v8::Value> xProp = ::Nan::Get(
                center,
                ::ngPlasmid::JSAware::x
            ).ToLocalChecked();
            float x = xProp->NumberValue();

            ::v8::Local<::v8::Value> yProp = ::Nan::Get(
                center,
                ::ngPlasmid::JSAware::y
            ).ToLocalChecked();
            float y = yProp->NumberValue();
            
            ::v8::Local<::v8::Value> widthProp = ::Nan::Get(
                track,
                ::ngPlasmid::JSAware::width
            ).ToLocalChecked();
            float width = widthProp->NumberValue();

            ::Nan::Set(
                track,
                ::ngPlasmid::JSAware::_batchedSVGPath,
                ::Nan::New(
                    ::ngPlasmid::pathDonut(
                        x,
                        y,
                        radius,
                        width
                    )
                ).ToLocalChecked()
            );

            #ifdef PROFILE_NGPLASMID
                PROFILER_END();
            #endif
        }
    }

    inline std::string pathDonut(
        float x,
        float y,
        float radius,
        float width
    ) {
        #ifdef PROFILE_NGPLASMID
            PROFILER_START(pathDonut);
        #endif

        std::string res;
        res.reserve(200);
        
        ::ngPlasmid::Point innerRingStart = ::ngPlasmid::polarToCartesian(x,y,radius,359.99);
        ::ngPlasmid::Point innerRingEnd = ::ngPlasmid::polarToCartesian(x,y,radius,0);

        ::ngPlasmid::Point outerRingStart = ::ngPlasmid::polarToCartesian(x,y,radius+width,359.99);
        ::ngPlasmid::Point outerRingEnd = ::ngPlasmid::polarToCartesian(x,y,radius+width,0);

        res += "M";
        res += " ";
        res += std::to_string(innerRingStart.x);
        res += " ";
        res += std::to_string(innerRingStart.y);
        res += " ";

        res += "A";
        res += " ";
        res += std::to_string(radius);
        res += " ";
        res += std::to_string(radius);
        res += " ";
        res += "0";
        res += " ";
        res += "1";
        res += " ";
        res += "0";
        res += " ";
        res += std::to_string(innerRingEnd.x);
        res += " ";
        res += std::to_string(innerRingEnd.y);
        res += " ";

        res += "M";
        res += " ";
        res += std::to_string(outerRingStart.x);
        res += " ";
        res += std::to_string(outerRingStart.y);
        res += " ";

        res += "A";
        res += " ";
        res += std::to_string(radius+width);
        res += " ";
        res += std::to_string(radius+width);
        res += " ";
        res += "0";
        res += " ";
        res += "1";
        res += " ";
        res += "0";
        res += " ";
        res += std::to_string(outerRingEnd.x);
        res += " ";
        res += std::to_string(outerRingEnd.y);
        res += " ";

        #ifdef PROFILE_NGPLASMID
            PROFILER_END();
        #endif

        return res;

    }    
}