#pragma once

#include <string>

#include <nan.h>

#include "polarToCartesian.hpp"
#include "point.hpp"

namespace ngPlasmid
{
    inline const std::string pathArc(
        long double x,
        long double y,
        long double radius,
        long double startAngle,
        long double endAngle,
        long double width,
        long double arrowStartWidth,
        long double arrowStartLength,
        long double arrowStartAngle,
        long double arrowEndWidth,
        long double arrowEndLength,
        long double arrowEndAngle
    ) {
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
        return "";
    }
}