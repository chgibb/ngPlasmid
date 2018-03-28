#pragma once

#define _USE_MATH_DEFINES
#include <cmath>

#include "point.hpp"

namespace ngPlasmid
{
    const float JS_PI = 3.141592653589793;
    inline ::ngPlasmid::Point polarToCartesian(
        float centerX,
        float centerY,
        float radius,
        float angleInDegrees
    ) {
        ::ngPlasmid::Point res;
        float angleInRadians = (angleInDegrees - 90) * JS_PI / 180.0;
        res.x = centerX + (radius * std::cos(angleInRadians));
        res.y = centerY + (radius * std::sin(angleInRadians));
        return res;
    }
}