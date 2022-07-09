import React, {useEffect, useRef, useState} from 'react';

import {
  Animated,
  Dimensions,
  Easing,
  PanResponder,
  Pressable,
  Text,
  TouchableOpacity,
  View,
  ViewBase,
} from 'react-native';
import styled from 'styled-components/native';
import icon from './icon';

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
  position: absolute;
`;

const Btn = styled.TouchableOpacity`
  margin: 0px 10px;
`;

const BtnContainer = styled.View`
  flex-direction: row;
  flex: 1;
`;

const CardContainer = styled.View`
  flex: 3;
  justify-content: center;
  align-items: center;
`;

export default function App() {
  // Values
  const scale = useRef(new Animated.Value(1)).current;
  const position = useRef(new Animated.Value(0)).current;
  const rotation = position.interpolate({
    inputRange: [-250, 250],
    outputRange: ['-15deg', '15deg'],
    //한계를 넘어도 작동
    // extrapolate: 'extend',
    // extrapolate: 'identity',
    //시작과 끝점이 있어서 한계점이넘거가면 작동하지않음
    // extrapolate: 'clamp',
  });
  // position.addListener(() =>
  //   console.log('posiiton:', position, 'rotate', rotation),
  // );

  const secondScale = position.interpolate({
    inputRange: [-300, 0, 300],
    outputRange: [1, 0.7, 1],
    extrapolate: 'clamp',
  });
  // Animations
  const onPressOut = Animated.spring(scale, {
    toValue: 1,
    useNativeDriver: true,
  });
  const onPressIn = Animated.spring(scale, {
    toValue: 0.95,
    useNativeDriver: true,
  });
  const goCenter = Animated.spring(position, {
    toValue: 0,
    useNativeDriver: true,
  });
  const goLeft = Animated.spring(position, {
    toValue: -500,
    tension: 5,
    useNativeDriver: true,
    restDisplacementThreshold: 100,
    restSpeedThreshold: 100,
  });
  const goRight = Animated.spring(position, {
    toValue: 500,
    tension: 5,
    useNativeDriver: true,
  });
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, {dx}) => {
        position.setValue(dx);
      },
      onPanResponderGrant: () => onPressIn.start(),
      onPanResponderRelease: (_, {dx}) => {
        if (dx < -250) {
          goLeft.start(onDismiss);
        } else if (dx > 250) {
          goRight.start(onDismiss);
        } else {
          Animated.parallel([onPressOut, goCenter]).start();
        }
      },
    }),
  ).current;

  //State
  const [index, setIndex] = useState(0);
  const onDismiss = () => {
    scale.setValue(1);
    setIndex(prev => prev + 1);
    position.setValue(0);
  };

  const closePress = () => {
    goLeft.start(onDismiss);
  };
  const checkPress = () => {
    goRight.start(onDismiss);
  };

  return (
    <Container>
      <CardContainer>
        <Card
          // {...panResponder.panHandlers} 여기도 추가하면 무한으로 됨
          style={{transform: [{scale: secondScale}]}}>
          <Text>{icon[index + 1]}</Text>
        </Card>
        <Card
          {...panResponder.panHandlers}
          style={{
            transform: [{scale}, {translateX: position}, {rotateZ: rotation}],
          }}>
          <Text>{icon[index]}</Text>
        </Card>
      </CardContainer>
      <BtnContainer>
        <Btn onPress={closePress}>
          <Text>닫기</Text>
        </Btn>
        <Btn onPress={checkPress}>
          {/* <Ionicons name="checkmark-circle" color="white" size={58} /> */}
          <Text>열기</Text>
        </Btn>
      </BtnContainer>
    </Container>
  );
}
