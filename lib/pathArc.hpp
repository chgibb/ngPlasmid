#pragma once

#include <string>

#include <nan.h>

#include "polarToCartesian.hpp"

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
    );

    namespace JSAware
    {
        
    }
}