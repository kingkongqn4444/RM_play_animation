import {Dimensions, Pressable, StyleSheet} from 'react-native';
import React from 'react';
import Animated, {
  FadeInUp,
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
const {width, height} = Dimensions.get('window');
import {Portal} from '@gorhom/portal';
import {
  PanGestureHandler,
  PinchGestureHandler,
} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';

const PhotoDetailModal = ({imageData}) => {
  const {image, specs} = imageData;
  const anim = useSharedValue(0);
  const animY = useSharedValue(0);
  const animScale = useSharedValue(1);
  const animFocalX = useSharedValue(0);
  const animFocalY = useSharedValue(0);
  const onBackPress = React.useCallback(() => {
    const callback = () => alert('sss');
    anim.value = withTiming(
      0,
      {},
      isFinished => isFinished && runOnJS(callback)(),
    );
  }, []);

  const panGestureHandler = useAnimatedGestureHandler({
    onActive: ({translationY}) => {
      animY.value = translationY * 0.4;
    },
    onEnd: ({translationY}) => {
      if (translationY > height * 0.3) {
        runOnJS(onBackPress)();
        animY.value = withTiming(0);
      } else {
        animY.value = withTiming(0);
      }
    },
  });
  const pinchGestureHandler = useAnimatedGestureHandler({
    onActive: ({scale, focalY, focalX}) => {
      animScale.value = scale;
      animFocalX.value = width / 2 - focalX;
      animFocalY.value = height / 2 - focalY;
    },
    onEnd: () => {
      animScale.value = withTiming(1);
      animFocalX.value = withTiming(0);
      animFocalY.value = withTiming(0);
    },
  });
  const imageContainerStyle = useAnimatedStyle(() => {
    if (!image || !specs) {
      return {
        width: 0,
        height: 0,
      };
    }
    const {height: actualHeight, width: actualWidth} = image;
    const isPortrait = actualWidth < actualHeight;
    const targetWidth = isPortrait ? Math.min(actualWidth, width) : width;
    const targetHeight = Math.min(
      (targetWidth / actualWidth) * actualHeight,
      height,
    );
    const targetX = (width - targetWidth) / 2;
    const targetY = (height - targetHeight) / 2;
    return {
      left: interpolate(anim.value, [0, 1], [0, 300]),
      top: interpolate(anim.value, [0, 1], [200, 300]),
      width: interpolate(anim.value, [0, 1], [specs.width, 400]),
      height: interpolate(anim.value, [0, 1], [specs.height, 400]),
      borderRadius: interpolate(anim.value, [0, 1], [5, 0]),
      transform: [
        {
          translateY: animY.value,
        },
        {
          translateX: -animFocalX.value,
        },
        {
          translateY: -animFocalY.value,
        },
        {
          scale: animScale.value,
        },
        {
          translateX: animFocalX.value,
        },
        {
          translateY: animFocalY.value,
        },
      ],
    };
  });
  const opacityStyle = useAnimatedStyle(() => ({
    opacity: anim.value * interpolate(animY.value, [0, height * 0.3], [1, 0]),
  }));
  return (
    <React.Fragment>
      <Portal>
        <PinchGestureHandler onGestureEvent={pinchGestureHandler}>
          <Animated.View style={[styles.container, {zIndex: true ? 99 : -99}]}>
            <PanGestureHandler
              maxPointers={1}
              onGestureEvent={panGestureHandler}>
              <Animated.View
                style={[
                  styles.container,
                  {
                    zIndex: true ? 99 : -99,
                  },
                ]}>
                <Animated.View style={[styles.backdrop, opacityStyle]}>
                  <Pressable
                    onPress={onBackPress}
                    style={styles.backdropInner}
                  />
                </Animated.View>
                <Animated.View style={[imageContainerStyle]}>
                  <Animated.Image
                    style={{width: width, height: 300}}
                    resizeMode="cover"
                    source={{
                      uri: 'https://jes.edu.vn/wp-content/uploads/2017/10/h%C3%ACnh-%E1%BA%A3nh.jpg',
                    }}
                  />
                </Animated.View>
                <Animated.View
                  entering={FadeInUp}
                  style={[styles.authorContainer, opacityStyle]}>
                  <LinearGradient
                    style={styles.bottomBg}
                    colors={[
                      'rgba(0,0,0,0)',
                      'rgba(0,0,0,0.5)',
                      'rgba(0,0,0,0.8)',
                    ]}
                  />
                </Animated.View>
              </Animated.View>
            </PanGestureHandler>
          </Animated.View>
        </PinchGestureHandler>
      </Portal>
    </React.Fragment>
  );
};

export default PhotoDetailModal;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
    backgroundColor: 'rgba(0,0,0,0.95)',
  },
  backdropInner: {
    flex: 1,
  },
  authorContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  bottomBg: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  header: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 53,
    paddingHorizontal: 20,
    zIndex: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  btnHeader: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
});
