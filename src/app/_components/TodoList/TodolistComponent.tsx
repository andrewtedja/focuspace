"use client";
import React, { useState } from "react";
import { Rnd } from "react-rnd";
import TodoList from "./TodoList";
import TimerPomodoro from "./TimerPodomoro";

import { Card} from "~/components/ui/card";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/ui/tabs";

const TodolistComponent = () => {
  const [size, setSize] = useState({ width: 450, height: 400 });
  return (
    <Rnd
      size={{ width: size.width, height: size.height }}
      onResize={(e, direction, ref, delta, position) => {
      setSize({
        width: ref.offsetWidth,
        height: ref.offsetHeight
      });
      }}
      minWidth={240}
      minHeight={300}
      bounds="window"
    >
      <div className="max-w-md mx-auto">
        <Card className="rounded-lg overflow-hidden">
          <Tabs defaultValue="timer" className="w-full">
            <TabsList 
              className="grid w-full grid-cols-2 h-14"
              style={{ backgroundColor: "#D4D770" }}
            >
              <TabsTrigger value="timer" className="text-base font-medium">Timer</TabsTrigger>
              <TabsTrigger value="todo" className="text-base font-medium">To-do List</TabsTrigger>
            </TabsList>
            
            <TabsContent value="timer" className="p-0 m-0">
              <TimerPomodoro show={true} onClose={() => {}} />
            </TabsContent>
            
            <TabsContent value="todo" className="p-0 m-0">
              <TodoList show={true} onClose={() => {}} />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </Rnd>
  );
};

export default TodolistComponent;