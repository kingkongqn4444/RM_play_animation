import {Image, Pressable} from 'react-native';
import React, {useRef} from 'react';

const ImageView = ({
  data,
  style,
  onPress,
  isCover,
  disabledPress,
  ...imageProps
}) => {
  const imageRef = useRef();
  const onImagePress = React.useCallback(() => {
    imageRef.current?.measure((x, y, width, height, pageX, pageY) => {
      onPress && onPress(data, {x, y, width, height, pageX, pageY});
    });
  }, []);

  return (
    <Pressable
      disabled={disabledPress}
      delayPressOut={300}
      onPress={onImagePress}
      style={{height: '100%', width: '100%'}}>
      <Image
        ref={imageRef}
        source={{
          uri: 'https://jes.edu.vn/wp-content/uploads/2017/10/h%C3%ACnh-%E1%BA%A3nh.jpg',
        }}
        style={[
          {
            position: 'absolute',
            backgroundColor: '#FFF',
            padding: 5,
            right: 5,
            top: 5,
            borderRadius: 5,
          },
          style,
        ]}
        {...imageProps}
      />
    </Pressable>
  );
};

export default ImageView;
