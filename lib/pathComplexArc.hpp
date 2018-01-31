#pragma once
#include <ios>
#include <sstream>
#include <iomanip>
#include <limits>
#include <string>

#include <nan.h>

#include "point.hpp"
#include "polarToCartesian.hpp"
namespace ngPlasmid
{
    const std::string pathComplexArc(
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
        //std::stringstream ss;
        std::string ss;

        ss.reserve(401);

        ngPlasmid::Point start;
        ngPlasmid::Point start2;
        ngPlasmid::Point end;
        char arcSweep;
        
        ngPlasmid::Point arrow_start_1;
        ngPlasmid::Point arrow_start_2;
        ngPlasmid::Point arrow_start_3;
        ngPlasmid::Point arrow_start_4;

        ngPlasmid::Point arrow_end_1;
        ngPlasmid::Point arrow_end_2;
        ngPlasmid::Point arrow_end_3;
        ngPlasmid::Point arrow_end_4;

        endAngle = endAngle - (arrowEndLength < 0 ? 0 : arrowEndLength);
        startAngle = startAngle + (arrowStartLength < 0 ? 0 : arrowStartLength);

        start = ngPlasmid::polarToCartesian(x, y, radius, endAngle);
        end = ngPlasmid::polarToCartesian(x, y, radius, startAngle);

        arrow_start_1 = ngPlasmid::polarToCartesian(x, y, radius - arrowStartWidth, startAngle + arrowStartAngle);
        arrow_start_2 = ngPlasmid::polarToCartesian(x, y, radius + (width / 2), startAngle - arrowStartLength);
        arrow_start_3 = ngPlasmid::polarToCartesian(x, y, radius + width + arrowStartWidth, startAngle + arrowStartAngle);
        arrow_start_4 = ngPlasmid::polarToCartesian(x, y, radius + width, startAngle);
        arrow_end_1 = ngPlasmid::polarToCartesian(x, y, radius + width + arrowEndWidth, endAngle - arrowEndAngle);
        arrow_end_2 = ngPlasmid::polarToCartesian(x, y, radius + (width / 2), endAngle + arrowEndLength);
        arrow_end_3 = ngPlasmid::polarToCartesian(x, y, radius - arrowEndWidth, endAngle - arrowEndAngle);
        arrow_end_4 = ngPlasmid::polarToCartesian(x, y, radius, endAngle);
        start2 = ngPlasmid::polarToCartesian(x, y, radius + width, endAngle);
        arcSweep = endAngle - startAngle <= 180 ? '0' : '1';

        //ss.precision(std::numeric_limits<long double>::digits10 + 1);

        ss += "M";
        ss += " ";
        ss += std::to_string(start.x);
        ss += " ";
        ss += std::to_string(start.y);
        ss += " ";

        ss += "A";
        ss += " ";
        ss += std::to_string(radius);
        ss += " ";
        ss += std::to_string(radius);
        ss += " ";
        ss += "0";
        ss += " ";
        ss += arcSweep;
        ss += " ";
        ss += "0";
        ss += " ";
        ss += std::to_string(end.x);
        ss += " ";
        ss += std::to_string(end.y);
        ss += " ";

        ss += "L";
        ss += " ";
        ss += std::to_string(arrow_start_1.x);
        ss += " ";
        ss += std::to_string(arrow_start_1.y);
        ss += " ";

        ss += "L";
        ss += " ";
        ss += std::to_string(arrow_start_2.x);
        ss += " ";
        ss += std::to_string(arrow_start_2.y);
        ss += " ";

        ss += "L";
        ss += " ";
        ss += std::to_string(arrow_start_3.x);
        ss += " ";
        ss += std::to_string(arrow_start_3.y);
        ss += " ";

        ss += "L";
        ss += " ";
        ss += std::to_string(arrow_start_4.x);
        ss += " ";
        ss += std::to_string(arrow_start_4.y);
        ss += " ";

        ss += "A";
        ss += " ";
        ss += std::to_string(radius + width);
        ss += " ";
        ss += std::to_string(radius + width);
        ss += " ";
        ss += "0";
        ss += " ";
        ss += arcSweep;
        ss += " ";
        ss += "1";
        ss += " ";
        ss += std::to_string(start2.x);
        ss += " ";
        ss += std::to_string(start2.y);
        ss += " ";

        ss += "L";
        ss += " ";
        ss += std::to_string(arrow_end_1.x);
        ss += " ";
        ss += std::to_string(arrow_end_1.y);
        ss += " ";

        ss += "L";
        ss += " ";
        ss += std::to_string(arrow_end_2.x);
        ss += " ";
        ss += std::to_string(arrow_end_2.y);
        ss += " ";        

        ss += "L";
        ss += " ";
        ss += std::to_string(arrow_end_3.x);
        ss += " ";
        ss += std::to_string(arrow_end_3.y);
        ss += " ";

        ss += "L";
        ss += " ";
        ss += std::to_string(arrow_end_4.x);
        ss += " ";
        ss += std::to_string(arrow_end_4.y);
        ss += " ";

        ss += "z";          

        //return ss.str();
        return ss;
    }

    namespace JSExport
    {
        void pathComplexArc(const Nan::FunctionCallbackInfo<v8::Value>&args)
        {
            args.GetReturnValue().Set(
                Nan::New(
                    ngPlasmid::pathComplexArc(
                        args[0]->NumberValue(),
                        args[1]->NumberValue(),
                        args[2]->NumberValue(),
                        args[3]->NumberValue(),
                        args[4]->NumberValue(),
                        args[5]->NumberValue(),
                        args[6]->NumberValue(),
                        args[7]->NumberValue(),
                        args[8]->NumberValue(),
                        args[9]->NumberValue(),
                        args[10]->NumberValue(),
                        args[11]->NumberValue()
                    ).c_str()
                ).ToLocalChecked()
            );
        }
    }
}