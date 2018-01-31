#pragma once
#ifdef __WIN32
    #define _USE_MATH_DEFINES
#endif
#include <cmath>
#include "point.hpp"
namespace ngPlasmid
{
    Point polarToCartesian(
        long double centerX,
        long double centerY,
        long double radius,
        long double angleInDegrees
    ) {
        Point res;
        long double angleInRadians = (angleInDegrees - 90) * M_PI / 180.0;
        res.x = centerX + (radius * std::cos(angleInRadians));
        res.y = centerY + (radius * std::sin(angleInRadians));
        return res;
    }
}