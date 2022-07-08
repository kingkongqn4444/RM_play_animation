import {PortalProvider} from '@gorhom/portal';
import {isEmpty} from 'lodash';
import React, {useState} from 'react';
import {Dimensions, Image, StyleSheet, View} from 'react-native';
import {PinchGestureHandler} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import PhotoCarousel from './PhotoCarousel';
import PhotoDetailModal from './PhotoDetailModal';

const MAX_COLUMN = 6;
const MIN_COLUMN = 1;
const PADDING = 10;
const SCALE_THRESHOLD = 0.3;
const {width} = Dimensions.get('window');

const getGridItemSize = (column: any, margin = 10) => {
  return (width - margin * (column + 1)) / column;
};
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const data = [
  'https://upanh123.com/wp-content/uploads/2020/11/anh-tho-chibi.0.jpg',
  'https://upanh123.com/wp-content/uploads/2020/11/anh-tho-chibi.0.jpg',
  'https://upanh123.com/wp-content/uploads/2020/11/anh-tho-chibi.0.jpg',
  'https://upanh123.com/wp-content/uploads/2020/11/anh-tho-chibi.0.jpg',
  'https://upanh123.com/wp-content/uploads/2020/11/anh-tho-chibi.0.jpg',
  'https://upanh123.com/wp-content/uploads/2020/11/anh-tho-chibi.0.jpg',
  'https://upanh123.com/wp-content/uploads/2020/11/anh-tho-chibi.0.jpg',
  'https://upanh123.com/wp-content/uploads/2020/11/anh-tho-chibi.0.jpg',
  'https://upanh123.com/wp-content/uploads/2020/11/anh-tho-chibi.0.jpg',
  'https://upanh123.com/wp-content/uploads/2020/11/anh-tho-chibi.0.jpg',
  'https://upanh123.com/wp-content/uploads/2020/11/anh-tho-chibi.0.jpg',
  'https://upanh123.com/wp-content/uploads/2020/11/anh-tho-chibi.0.jpg',
  'https://upanh123.com/wp-content/uploads/2020/11/anh-tho-chibi.0.jpg',
  'https://upanh123.com/wp-content/uploads/2020/11/anh-tho-chibi.0.jpg',
  'https://upanh123.com/wp-content/uploads/2020/11/anh-tho-chibi.0.jpg',
  'https://upanh123.com/wp-content/uploads/2020/11/anh-tho-chibi.0.jpg',
  'https://upanh123.com/wp-content/uploads/2020/11/anh-tho-chibi.0.jpg',
  'https://upanh123.com/wp-content/uploads/2020/11/anh-tho-chibi.0.jpg',
  'https://upanh123.com/wp-content/uploads/2020/11/anh-tho-chibi.0.jpg',
  'https://upanh123.com/wp-content/uploads/2020/11/anh-tho-chibi.0.jpg',
];

const data2 = [
  'https://upanh123.com/wp-content/uploads/2020/11/anh-tho-chibi.0.jpg',
  'https://upanh123.com/wp-content/uploads/2020/11/anh-tho-chibi.0.jpg',
  'https://upanh123.com/wp-content/uploads/2020/11/anh-tho-chibi.0.jpg',
];

const App = () => {
  const animGridSize = useSharedValue(getGridItemSize(3));
  const animColumn = useSharedValue(3);
  const animGridLayout = useSharedValue(1);
  const gridItemStyle = useAnimatedStyle(() => ({
    height: animGridSize.value,
    width: animGridSize.value,
  }));
  const girdContainerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: animGridLayout.value,
      },
    ],
  }));

  const renderGridItem = item => {
    return (
      <Animated.View
        key={Math.random()}
        style={[styles.gridItem, gridItemStyle]}>
        <Image style={styles.image} source={{uri: item}} />
      </Animated.View>
    );
  };

  const [imageData, setImageData] = useState({});

  const pingestureHandler = useAnimatedGestureHandler({
    onActive: ({scale}: any) => {
      animGridLayout.value = 1 - (1 - scale) * 0.1;
    },
    onEnd: ({scale}: any) => {
      if (scale > 1 + SCALE_THRESHOLD && animColumn.value > MIN_COLUMN) {
        animColumn.value = animColumn.value - 1;
      } else if (scale < 1 - SCALE_THRESHOLD && animColumn.value < MAX_COLUMN) {
        animColumn.value = animColumn.value + 1;
      }
      const size =
        (width - PADDING * (animColumn.value + 1)) / animColumn.value;
      animGridSize.value = withTiming(size);
      animGridLayout.value = withSpring(1);
    },
  });

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <PortalProvider>
        <View style={styles.container}>
          {/* {!isEmpty(imageData) && <PhotoDetailModal imageData={imageData} />}
          <PhotoCarousel
            data={data2}
            onPressImage={(image, specs) =>
              setImageData({image: image, specs: specs})
            }
          /> */}
          <PinchGestureHandler onGestureEvent={pingestureHandler}>
            <Animated.ScrollView
              style={[styles.gridModeContainer, girdContainerStyle]}>
              <View style={styles.gridContainer}>
                {data.map(renderGridItem)}
              </View>
            </Animated.ScrollView>
          </PinchGestureHandler>
        </View>
      </PortalProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gridModeContainer: {
    flex: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 5,
  },
  gridItem: {
    margin: 5,
    alignSelf: 'center',
  },
  image: {
    height: 100,
    width: 100,
    borderRadius: 5,
    backgroundColor: 'red',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
