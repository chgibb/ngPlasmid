#pragma once
#include <cmath>
#include "point.hpp"
namespace ngPlasmid
{
    Point polarToCartesian(
        double centerX,
        double centerY,
        double radius,
        double angleInDegrees
    ) {
        Point res;
        double angleInRadians = (angleInDegrees - 90) * M_PI / 180.0;
        res.x = centerX + (radius * std::cos(angleInRadians));
        res.y = centerY + (radius * std::sin(angleInRadians));
        return res;
    }
}