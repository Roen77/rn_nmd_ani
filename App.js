import React, {useEffect, useRef, useState} from 'react';

import {
  Animated,
  Dimensions,
  Easing,
  PanResponder,
  Pressable,
  TouchableOpacity,
  View,
  ViewBase,
} from 'react-native';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #00a8ff;
`;

const Card = styled(Animated.createAnimatedComponent(View))`
  background-color: white;
  width: 300px;
  height: 300px;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
`;

export default function App() {
  const scale = useRef(new Animated.Value(1)).current;
  const position = useRef(new Animated.Value(0)).current;
  const onPressIn = () =>
    Animated.spring(scale, {toValue: 0.95, useNativeDriver: true}).start();
  // const onPressOut = () =>
  //   Animated.spring(scale, {
  //     toValue: 1,
  //     useNativeDriver: true,
  //   }).start();
  const onPressOut = Animated.spring(scale, {
    toValue: 1,
    useNativeDriver: true,
  });

  const panResponder = useRef(
    PanResponder.create({
      //터치가 감지되면 active로 전환할거냐??
      // view에서 터치를 감지할지 결정할수있도록해줌
      onStartShouldSetPanResponder: () => true,
      //기존위치에서 아래위치를 더하는듯
      onPanResponderGrant: () => onPressIn(),
      onPanResponderMove: (_, {dx}) => {
        position.setValue(dx);
      },
      onPanResponderRelease: () => {
        //동시에 진행되는 애니메이션은 아래처럼
        Animated.parallel([
          onPressOut,
          Animated.spring(position, {
            toValue: 0,
            useNativeDriver: true,
          }),
        ]).start();
      },
    }),
  ).current;

  return (
    <Container>
      <Card
        {...panResponder.panHandlers}
        style={{
          transform: [{scale}, {translateX: position}],
        }}
      />
    </Container>
  );
}
