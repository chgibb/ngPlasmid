#pragma once

#include <nan.h>

namespace ngPlasmid
{
    namespace JSAware
    {
        ::v8::Local<::v8::String> interpolateAttributes;
        ::v8::Local<::v8::String> markers;
        ::v8::Local<::v8::String> radius;
        ::v8::Local<::v8::String> inner;
        ::v8::Local<::v8::String> arrowstartwidth;
        ::v8::Local<::v8::String> arrowstartlength;
        ::v8::Local<::v8::String> arrowstartangle;
        ::v8::Local<::v8::String> arrowendwidth;
        ::v8::Local<::v8::String> arrowendlength;
        ::v8::Local<::v8::String> arrowendangle;
        ::v8::Local<::v8::String> center;
        ::v8::Local<::v8::String> x;
        ::v8::Local<::v8::String> y;
        ::v8::Local<::v8::String> width;
        ::v8::Local<::v8::String> _start;
        ::v8::Local<::v8::String> _end;
        ::v8::Local<::v8::String> _vadjust;
        ::v8::Local<::v8::String> _batchedSVGPath;

        void initPropKeys();
        void initPropKeys()
        {
            #ifdef PROFILE_NGPLASMID
                PROFILER_START(initPropKeys);
            #endif

            ::ngPlasmid::JSAware::interpolateAttributes = ::Nan::New("interpolateAttributes").ToLocalChecked();
            ::ngPlasmid::JSAware::_batchedSVGPath = ::Nan::New("_batchedSVGPath").ToLocalChecked();

            ::ngPlasmid::JSAware::radius = ::Nan::New("radius").ToLocalChecked();

            ::ngPlasmid::JSAware::center = ::Nan::New("center").ToLocalChecked();
            ::ngPlasmid::JSAware::x = ::Nan::New("x").ToLocalChecked();
            ::ngPlasmid::JSAware::y = ::Nan::New("y").ToLocalChecked();
            ::ngPlasmid::JSAware::width = ::Nan::New("width").ToLocalChecked();
            ::ngPlasmid::JSAware::inner = ::Nan::New("inner").ToLocalChecked();
            ::ngPlasmid::JSAware::width = ::Nan::New("width").ToLocalChecked();
            ::ngPlasmid::JSAware::arrowstartwidth = ::Nan::New("arrowstartwidth").ToLocalChecked();
            ::ngPlasmid::JSAware::arrowstartlength = ::Nan::New("arrowstartlength").ToLocalChecked();
            ::ngPlasmid::JSAware::arrowstartangle = ::Nan::New("arrowstartangle").ToLocalChecked();
            ::ngPlasmid::JSAware::arrowendwidth = ::Nan::New("arrowendwidth").ToLocalChecked();
            ::ngPlasmid::JSAware::arrowendlength = ::Nan::New("arrowendlength").ToLocalChecked();
            ::ngPlasmid::JSAware::arrowendangle = ::Nan::New("arrowendangle").ToLocalChecked();
            ::ngPlasmid::JSAware::_start = ::Nan::New("_start").ToLocalChecked();
            ::ngPlasmid::JSAware::_end = ::Nan::New("_end").ToLocalChecked();
            ::ngPlasmid::JSAware::_vadjust = ::Nan::New("_vadjust").ToLocalChecked();
            
            #ifdef PROFILE_NGPLASMID
                PROFILER_END();
            #endif
        }
    }
}