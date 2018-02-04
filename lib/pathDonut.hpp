#pragma once

#include <string>
#include <iostream>

#include <nan.h>

#include "polarToCartesian.hpp"

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
        void pathDonut(const v8::Handle<v8::Object>&track)
        {
            //v8::Handle<v8::Object> track = v8::Handle<v8::Object>::Cast(args[0]);
            std::cerr<<"getting center\n";

            v8::Handle<v8::Object> center = v8::Handle<v8::Object>::Cast(
                Nan::Get(   
                    track,
                    Nan::New("center").ToLocalChecked()
                ).ToLocalChecked()
            );
            


            std::cerr<<"getting x\n";
            v8::Handle<v8::Value> xProp = Nan::Get(
                center,
                Nan::New("x").ToLocalChecked()
            ).ToLocalChecked();
            long double x = xProp->NumberValue();

            std::cerr<<"getting y\n";
            v8::Local<v8::Value> yProp = Nan::Get(
                center,
                Nan::New("y").ToLocalChecked()
            ).ToLocalChecked();
            long double y = yProp->NumberValue();
            
            std::cerr<<"radius \n";
            v8::Local<v8::Value> radiusProp = Nan::Get(
                track,
                Nan::New("radius").ToLocalChecked()
            ).ToLocalChecked();
            long double radius = radiusProp->NumberValue();
            
            std::cerr<<"width \n";
            v8::Local<v8::Value> widthProp = Nan::Get(
                track,
                Nan::New("width").ToLocalChecked()
            ).ToLocalChecked();
            long double width = widthProp->NumberValue();


            Nan::Set(
                track,
                Nan::New("_batchedSVGPath").ToLocalChecked(),
                Nan::New(
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
        std::cerr<<"called pathdonut\n";
        std::string res;
        res.reserve(200);
        res = "test";
        return res;
    }    
}