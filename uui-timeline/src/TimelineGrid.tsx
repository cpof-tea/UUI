import React from 'react';
import { TimelineTransform } from './TimelineTransform';
import { msPerDay } from './helpers';
import { Canvas, CanvasProps } from './Canvas';
import { CanvasDrawGridTodayLineProps, CanvasDrawHolidayProps, CanvasDrawLineProps, CanvasDrawTimelineElementProps,
    CanvasDrawWeekendProps, timelineGrid } from './draw';

export interface TimelineGridProps extends CanvasProps {
    drawLine?: (props: CanvasDrawLineProps) => void;
    drawMinutes?: (props: CanvasDrawTimelineElementProps) => void;
    drawHours?: (props: CanvasDrawTimelineElementProps) => void;
    drawDays?: (props: CanvasDrawTimelineElementProps) => void;
    drawQuoterHours?: (props: CanvasDrawTimelineElementProps) => void;
    drawHolidays?: (props: CanvasDrawTimelineElementProps) => void;
    drawWeeks?: (props: CanvasDrawTimelineElementProps) => void;
    drawMonths?: (props: CanvasDrawTimelineElementProps) => void;
    drawYears?: (props: CanvasDrawTimelineElementProps) => void;
    drawToday?: (props: CanvasDrawGridTodayLineProps) => void;
    drawHoliday?: (props: CanvasDrawHolidayProps) => void;
    drawWeekend?: (props: CanvasDrawWeekendProps) => void;
    
    defaultLineColor?: string;
    todayLineColor?: string;
    weekendCellColor?: string;
    holidayCellColor?: string;
}
export function TimelineGrid({ 
    timelineController,
    drawLine,
    drawMinutes,
    drawQuoterHours,
    drawHours,
    drawDays,
    drawHolidays,
    drawWeeks,
    drawMonths,
    drawYears,
    drawToday,
    drawWeekend,
    drawHoliday,

    defaultLineColor = timelineGrid.defaultColors.defaultLineColor,
    todayLineColor = timelineGrid.defaultColors.todayLineColor,
    weekendCellColor = timelineGrid.defaultColors.weekendCellColor,
    holidayCellColor = timelineGrid.defaultColors.holidayCellColor,
    ...restProps
}: TimelineGridProps) {
    const canvasHeight = restProps.canvasHeight ?? 60;

    const draw = (context: CanvasRenderingContext2D, timelineTransform: TimelineTransform) => {
        context.clearRect(0, 0, timelineTransform.widthPx, canvasHeight);
        context.strokeStyle = defaultLineColor;

        const pxPerDay = timelineTransform.pxPerMs * msPerDay;

        const drawProps = { context, timelineTransform, canvasHeight };
        const options = {
            ...drawProps,
            drawLine: drawLine ?? timelineGrid.drawLine,
        };
        if (pxPerDay >= 40000) {
            (drawMinutes ?? timelineGrid.drawMinutes)(options);
        }

        if (pxPerDay >= 1600) {
            (drawQuoterHours ?? timelineGrid.drawQuoterHours)(options);
        }

        if (pxPerDay >= 190) {
            (drawHours ?? timelineGrid.drawHours)(options);
        }

        if (pxPerDay > 10) {
            (drawDays ?? timelineGrid.drawDays)(options);
        }

        if (pxPerDay > 6 && pxPerDay < 200) {
            (drawHolidays ?? timelineGrid.drawHolidays)({
                ...options,
                drawWeekend: drawWeekend ?? timelineGrid.drawWeekend,
                drawHoliday: drawHoliday ?? timelineGrid.drawHoliday,
                weekendCellColor,
                holidayCellColor,
            });
        }

        if (pxPerDay > 6) {
            (drawWeeks ?? timelineGrid.drawWeeks)(options);
        }

        if (pxPerDay > 0.5) {
            (drawMonths ?? timelineGrid.drawMonths)(options);
        }

        (drawYears ?? timelineGrid.drawYears)(options);
        (drawToday ?? timelineGrid.drawToday)({ ...drawProps, todayLineColor });
    };

    return (
        <Canvas
            draw={ restProps.draw ?? draw }
            canvasHeight={ canvasHeight }
            timelineController={ timelineController }
        />
    );
}
