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
        void pathDonut(const ::v8::Handle<::v8::Object>&track)
        {
            //::v8::Handle<::v8::Object> track = ::v8::Handle<::v8::Object>::Cast(args[0]);
            //std::cerr<<"getting center\n";

            ::v8::Handle<::v8::Object> center = ::v8::Handle<::v8::Object>::Cast(
                ::Nan::Get(   
                    track,
                    ::Nan::New("center").ToLocalChecked()
                ).ToLocalChecked()
            );
            


            //std::cerr<<"getting x\n";
            ::v8::Handle<::v8::Value> xProp = ::Nan::Get(
                center,
                ::Nan::New("x").ToLocalChecked()
            ).ToLocalChecked();
            long double x = xProp->NumberValue();

            //std::cerr<<"getting y\n";
            ::v8::Local<::v8::Value> yProp = ::Nan::Get(
                center,
                ::Nan::New("y").ToLocalChecked()
            ).ToLocalChecked();
            long double y = yProp->NumberValue();
            
            //std::cerr<<"radius \n";
            ::v8::Local<::v8::Value> radiusProp = ::Nan::Get(
                track,
                ::Nan::New("radius").ToLocalChecked()
            ).ToLocalChecked();
            long double radius = radiusProp->NumberValue();
            
            //std::cerr<<"width \n";
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
        }
    }

    inline std::string pathDonut(
        long double x,
        long double y,
        long double radius,
        long double width
    ) {
        //std::cerr<<"called pathdonut\n";
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

        return res;
    }    
}