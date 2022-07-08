import {Dimensions, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import ImageView from './ImageView';

const {width} = Dimensions.get('window');
const ITEM_WIDTH = width * 0.8;

const PhotoCarousel = ({data = [], onPressImage}) => {
  const animX = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: ({contentOffset: {x}}) => {
      animX.value = x;
    },
  });
  const renderImageItem = React.useCallback(({item, index}) => {
    return (
      <CarouselImage
        onPressImage={onPressImage}
        anim={animX}
        data={item}
        index={index}
      />
    );
  }, []);
  const renderCarouselPageIndicatorItem = (_, index) => {
    return <CarouselPoint key={index} index={index} anim={animX} />;
  };
  const imageKeyExtractor = React.useCallback(item => `${item.id}`, []);
  return (
    <View style={styles.container}>
      <Animated.FlatList
        style={{
          width: ITEM_WIDTH,
          overflow: 'visible',
        }}
        pagingEnabled
        scrollEventThrottle={20}
        onScroll={scrollHandler}
        data={data}
        renderItem={renderImageItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={imageKeyExtractor}
      />
      <View style={styles.pageIndicator}>
        {data.map(renderCarouselPageIndicatorItem)}
      </View>
    </View>
  );
};

export default React.memo(PhotoCarousel);

const CarouselImage = React.memo(
  ({
    data,
    index,
    anim,
    onPressImage,
  }: {
    data: any;
    index: any;
    anim: any;
    onPressImage: any;
  }) => {
    const [inputRange] = useState([
      ITEM_WIDTH * (index - 1),
      ITEM_WIDTH * index,
      ITEM_WIDTH * (index + 1),
    ]);
    const onImagePress = React.useCallback((image: any, specs: any) => {
      onPressImage(image, specs);
    }, []);
    const imageContainerStyle = useAnimatedStyle(() => ({
      transform: [
        {
          translateX: interpolate(anim.value, inputRange, [
            -0.15 * ITEM_WIDTH,
            0,
            0.15 * ITEM_WIDTH,
          ]),
        },
        {
          scale: interpolate(anim.value, inputRange, [0.7, 1, 0.7]),
        },
      ],
      opacity: interpolate(anim.value, inputRange, [0.5, 1, 0.5]),
    }));
    return (
      <Animated.View style={[styles.carouselImage, imageContainerStyle]}>
        <ImageView onPress={onImagePress} style={styles.image} data={data} />
      </Animated.View>
    );
  },
);

const CarouselPoint = React.memo(({index, anim}: {index: any; anim: any}) => {
  const inputRange = [
    ITEM_WIDTH * (index - 1),
    ITEM_WIDTH * index,
    ITEM_WIDTH * (index + 1),
  ];
  const pointStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      anim.value,
      inputRange,
      [0.3, 1, 0.3],
      Extrapolate.CLAMP,
    ),
    backgroundColor: 'red',
    height: 8,
    width: interpolate(anim.value, inputRange, [8, 16, 8], Extrapolate.CLAMP),
    borderRadius: 4,
    marginHorizontal: 5,
  }));
  return <Animated.View style={pointStyle} />;
});

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
  },
  carouselImage: {
    height: 200,
    width: width * 0.8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  image: {
    borderRadius: 10,
  },
  pageIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingTop: 20,
  },
});
