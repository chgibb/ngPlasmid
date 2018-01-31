#pragma once
#define _USE_MATH_DEFINES
#include <cmath>
#include "point.hpp"
namespace ngPlasmid
{
    const long double JS_PI = 3.141592653589793;
    Point polarToCartesian(
        long double&centerX,
        long double&centerY,
        long double&radius,
        long double&angleInDegrees
    ) {
        Point res;
        long double angleInRadians = (angleInDegrees - 90) * JS_PI / 180.0;
        res.x = centerX + (radius * std::cos(angleInRadians));
        res.y = centerY + (radius * std::sin(angleInRadians));
        return res;
    }
}