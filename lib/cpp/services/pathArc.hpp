#pragma once

#include <string>

#include <nan.h>

#include "polarToCartesian.hpp"
#include "point.hpp"
#include "pathComplexArc.hpp"

namespace ngPlasmid
{
    inline const std::string pathArc(
        float x,
        float y,
        float radius,
        float startAngle,
        float endAngle,
        float width,
        float arrowStartWidth,
        float arrowStartLength,
        float arrowStartAngle,
        float arrowEndWidth,
        float arrowEndLength,
        float arrowEndAngle
    ) {
        #ifdef PROFILE_NGPLASMID
            PROFILER_START(pathArc);
        #endif

        std::string res;
        res.reserve(401);

        ::ngPlasmid::Point start;
        ::ngPlasmid::Point end;
        char arcSweep;

        if(startAngle == endAngle)
        {
            start = ::ngPlasmid::polarToCartesian(x,y,radius,startAngle);
            end = ::ngPlasmid::polarToCartesian(x,y,radius + width,startAngle);
            res += "M";
            res += " ";
            res += std::to_string(start.x);
            res += " ";
            res += std::to_string(start.y);
            res += " ";

            res += "L";
            res += " ";
            res += std::to_string(end.x);
            res += " ";
            res += std::to_string(end.y);
            #ifdef PROFILE_NGPLASMID
                PROFILER_END();
            #endif
            return res;
        }
        else
        {
            if(width == 1)
            {
                start = ::ngPlasmid::polarToCartesian(x,y,radius,startAngle);
                end = ::ngPlasmid::polarToCartesian(x,y,radius,endAngle);
                if(startAngle < endAngle)
                    arcSweep = endAngle - startAngle <= 180 ? '0' : '1';
                else
                    arcSweep = endAngle - startAngle <= 180 ? '1' : '0';
                
                res = "M";
                res += " ";
                res += std::to_string(start.x);
                res += " ";
                res += std::to_string(start.y);
                res += " ";

                res += "A";
                res += " ";
                res += std::to_string(radius);
                res += " ";
                res += std::to_string(radius);
                res += " ";
                res += "0";
                res += " ";
                res += arcSweep;
                res += " ";
                res += "1";
                res += " ";
                res += std::to_string(end.x);
                res += " ";
                res += std::to_string(end.y);
            }
            else
            {
                #ifdef PROFILE_NGPLASMID
                    PROFILER_END();
                #endif
                return ::ngPlasmid::pathComplexArc(
                    x,
                    y,
                    radius,
                    startAngle,
                    endAngle,
                    width,
                    arrowStartWidth,
                    arrowStartLength,
                    arrowStartAngle,
                    arrowEndWidth,
                    arrowEndLength,
                    arrowEndAngle
                );
            }
        }
        #ifdef PROFILE_NGPLASMID
            PROFILER_END();
        #endif
        return "";
    }
}