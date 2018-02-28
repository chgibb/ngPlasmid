#pragma once

#include <string>
#include <iostream>

#include <nan.h>

#include "polarToCartesian.hpp"
#include "point.hpp"

namespace ngPlasmid
{
    inline std::string pathDonut(
        long double,
        long double,
        long double,
        long double
    );

    namespace JSAware
    {
        ::v8::Local<::v8::String> center;
        ::v8::Local<::v8::String> x;
        ::v8::Local<::v8::String> y;
        ::v8::Local<::v8::String> width;
        void pathDonut(const ::v8::Handle<::v8::Object>&);
        void pathDonut(const ::v8::Handle<::v8::Object>&track)
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
                    ::Nan::New("center").ToLocalChecked()
                ).ToLocalChecked()
            );
            #ifdef PROFILE_NGPLASMID
                PROFILER_END();
            #endif

            ::v8::Handle<::v8::Value> xProp = ::Nan::Get(
                center,
                ::Nan::New("x").ToLocalChecked()
            ).ToLocalChecked();
            long double x = xProp->NumberValue();

            ::v8::Local<::v8::Value> yProp = ::Nan::Get(
                center,
                ::Nan::New("y").ToLocalChecked()
            ).ToLocalChecked();
            long double y = yProp->NumberValue();
            
            ::v8::Local<::v8::Value> radiusProp = ::Nan::Get(
                track,
                ::Nan::New("radius").ToLocalChecked()
            ).ToLocalChecked();
            long double radius = radiusProp->NumberValue();
            
            ::v8::Local<::v8::Value> widthProp = ::Nan::Get(
                track,
                ::Nan::New("width").ToLocalChecked()
            ).ToLocalChecked();
            long double width = widthProp->NumberValue();

            ::Nan::Set(
                track,
                ::Nan::New("_batchedSVGPath").ToLocalChecked(),
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
        long double x,
        long double y,
        long double radius,
        long double width
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