#pragma once
#include <string>

#include <nan.h>

#include "point.hpp"
#include "polarToCartesian.hpp"
namespace ngPlasmid
{
    std::string pathComplexArc(
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
        std::string res = "";

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

        res += "M";
        res += " ";
        res += start.x;
        res += " ";
        res += start.y;
        res += " ";

        res += "A";
        res += " ";
        res += radius;
        res += " ";
        res += radius;
        res += " ";
        res += "0";
        res += " ";
        res += arcSweep;
        res += " ";
        res += "0";
        res += " ";
        res += end.x;
        res += " ";
        res += end.y;
        res += " ";

        res += "L";
        res += " ";
        res += arrow_start_1.x;
        res += " ";
        res += arrow_start_1.y;
        res += " ";

        res += "L";
        res += " ";
        res += arrow_start_2.x;
        res += " ";
        res += arrow_start_2.y;
        res += " ";

        res += "L";
        res += " ";
        res += arrow_start_3.x;
        res += " ";
        res += arrow_start_3.y;
        res += " ";

        res += "L";
        res += " ";
        res += arrow_start_4.x;
        res += " ";
        res += arrow_start_4.y;
        res += " ";

        res += "A";
        res += " ";
        res += radius + width;
        res += " ";
        res += radius + width;
        res += " ";
        res += "0";
        res += " ";
        res += arcSweep;
        res += " ";
        res += "1";
        res += start2.x;
        res += " ";
        res += start2.y;
        res += " ";

        res += "L";
        res += " ";
        res += arrow_end_1.x;
        res += " ";
        res += arrow_end_1.y;
        res += " ";

        res += "L";
        res += " ";
        res += arrow_end_2.x;
        res += " ";
        res += arrow_end_2.y;
        res += " ";        

        res += "L";
        res += " ";
        res += arrow_end_3.x;
        res += " ";
        res += arrow_end_3.y;
        res += " ";

        res += "L";
        res += " ";
        res += arrow_end_4.x;
        res += " ";
        res += arrow_end_4.y;
        res += " ";

        res += "z";          


        return res;
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
                    )
                ).ToLocalChecked()
            );
        }
    }
}