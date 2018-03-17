#pragma once

#include <vector>

#include <nan.h>

#include "../services/propKeys.hpp"
#include "../services/point.hpp"
#include "../services/angle.hpp"
#include "../services/pathArc.hpp"
#include "../services/getAngle.hpp"

namespace ngPlasmid
{
    class TrackMarkerPack;
    inline void getTrackMarkerSVGPath(std::vector<TrackMarkerPack>*&);

    class TrackMarkerPack
    {
        public:
            long double radius;
            long double inner;
            long double arrowStartWidth;
            long double arrowStartLength;
            long double arrowStartAngle;
            long double arrowEndWidth;
            long double arrowEndLength;
            long double arrowEndAngle;
            long double radiusInner;
            long double x;
            long double y;
            long double width;
            long double start;
            long double end;
            long double vadjust;
            long double seqLength;
            ::ngPlasmid::Point center;
            long double trackRadius;

            int index;
            std::string path;
            TrackMarkerPack() = default;
    };

    inline void getTrackMarkerSVGPath(std::vector<TrackMarkerPack>*&packs)
    {
        #ifdef PROFILE_NGPLASMID
            PROFILER_START(getTrackMarkerSVGPath);
        #endif

        auto end = packs->end();
        for(auto it = packs->begin(); it != end; ++it)
        {
            long double startAngle;
            long double endAngle;
            long double end;

            startAngle = (it->start / it->seqLength) * 360;
            end = it->end || it->start;

            endAngle = ((end ? end : 0) / it->seqLength) * 360;
            endAngle = endAngle + ((endAngle < startAngle) ? 360 : 0);

            ::ngPlasmid::Angle angle;
            angle.start = startAngle;
            angle.end = endAngle;

            it->path =  ::ngPlasmid::pathArc(
                it->center.x,
                it->center.y,
                it->radiusInner,
                angle.start,
                angle.end,
                it->width,
                it->arrowStartWidth,
                it->arrowStartLength,
                it->arrowStartAngle,
                it->arrowEndWidth,
                it->arrowEndLength,
                it->arrowEndAngle
            );
        }

        #ifdef PROFILE_NGPLASMID
            PROFILER_END();
        #endif
    }

    namespace JSAware
    {
        void setTrackMarkerPackProps(
            const ::v8::Handle<::v8::Object>&,
            TrackMarkerPack&,
            long double,
            ::ngPlasmid::Point&,
            long double
        );
        void setTrackMarkerPackProps(
            const ::v8::Handle<::v8::Object>&marker,
            TrackMarkerPack&pack,
            long double seqLength,
            ::ngPlasmid::Point&center,
            long double trackRadius
        ) {
            #ifdef PROFILE_NGPLASMID
                PROFILER_START(JSAware::setTrackMarkerPackProps);
            #endif

            pack.seqLength = seqLength;
            pack.center = center;
            pack.trackRadius = trackRadius;


            #ifdef PROFILE_NGPLASMID
                PROFILER_START(get#marker#start);
            #endif
            pack.start = ::Nan::Get(
                marker,
                ::ngPlasmid::JSAware::_start
            ).ToLocalChecked()->NumberValue();
            #ifdef PROFILE_NGPLASMID
                PROFILER_END();
            #endif

            #ifdef PROFILE_NGPLASMID
                PROFILER_START(get#marker#end);
            #endif
            pack.end = ::Nan::Get(
                marker,
                ::ngPlasmid::JSAware::_end
            ).ToLocalChecked()->NumberValue();
            #ifdef PROFILE_NGPLASMID
                PROFILER_END();
            #endif

            #ifdef PROFILE_NGPLASMID
                PROFILER_START(marker#_vadjust);
            #endif
            pack.vadjust = ::Nan::Get(
                marker,
                ::ngPlasmid::JSAware::_vadjust
            ).ToLocalChecked()->NumberValue();
            #ifdef PROFILE_NGPLASMID
                PROFILER_END();
            #endif

            pack.radiusInner = trackRadius + pack.vadjust;

            #ifdef PROFILE_NGPLASMID
                PROFILER_START(marker#width);
            #endif
            pack.width = ::Nan::Get(
                marker,
                ::ngPlasmid::JSAware::width
            ).ToLocalChecked()->NumberValue();
            #ifdef PROFILE_NGPLASMID
                PROFILER_END();
            #endif

            #ifdef PROFILE_NGPLASMID
                PROFILER_START(marker#arrowstartwidth);
            #endif
            pack.arrowStartWidth = ::Nan::Get(
                marker,
                ::ngPlasmid::JSAware::arrowstartwidth
            ).ToLocalChecked()->NumberValue();
            #ifdef PROFILE_NGPLASMID
                PROFILER_END();
            #endif

            #ifdef PROFILE_NGPLASMID
                PROFILER_START(marker#arrowstartlength);
            #endif
            pack.arrowStartLength = ::Nan::Get(
                marker,
                ::ngPlasmid::JSAware::arrowstartlength
            ).ToLocalChecked()->NumberValue();
            #ifdef PROFILE_NGPLASMID
                PROFILER_END();
            #endif

             #ifdef PROFILE_NGPLASMID
                PROFILER_START(marker#arrowstartangle);
            #endif
            pack.arrowStartAngle = ::Nan::Get(
                marker,
                ::ngPlasmid::JSAware::arrowstartangle
            ).ToLocalChecked()->NumberValue();
            #ifdef PROFILE_NGPLASMID
                PROFILER_END();
            #endif

            #ifdef PROFILE_NGPLASMID
                PROFILER_START(marker#arrowendwidth);
            #endif
            pack.arrowEndWidth = ::Nan::Get(
                marker,
                ::ngPlasmid::JSAware::arrowendwidth
            ).ToLocalChecked()->NumberValue();
            #ifdef PROFILE_NGPLASMID
                PROFILER_END();
            #endif

            #ifdef PROFILE_NGPLASMID
                PROFILER_START(marker#arrowendlength);
            #endif
            pack.arrowEndLength = ::Nan::Get(
                marker,
                ::ngPlasmid::JSAware::arrowendlength
            ).ToLocalChecked()->NumberValue();
            #ifdef PROFILE_NGPLASMID
                PROFILER_END();
            #endif

             #ifdef PROFILE_NGPLASMID
                PROFILER_START(marker#arrowendangle);
            #endif
            pack.arrowEndAngle = ::Nan::Get(
                marker,
                ::ngPlasmid::JSAware::arrowendangle
            ).ToLocalChecked()->NumberValue();
            #ifdef PROFILE_NGPLASMID
                PROFILER_END();
            #endif

            #ifdef PROFILE_NGPLASMID
                PROFILER_END();
            #endif
        }
    }
}
