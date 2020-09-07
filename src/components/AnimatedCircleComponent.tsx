import Svg, { Circle } from 'react-native-svg';
import { Animated, Easing, Dimensions, View } from 'react-native';
import React from 'react';
import extractBrush from 'react-native-svg/lib/module/lib/extract/extractBrush';

// https://www.decoide.org/react-native/docs/animated.html

const AnimatedCircle = Animated.createAnimatedComponent(Circle);


export default class AnimatedCircleComponent extends Circle {

    constructor(props) {
        super(props);
        this.state = {
            circleRadius: new Animated.Value(props.r),
            fillValue: new Animated.Value(0)
        };

        this.state.circleRadius.addListener((circleRadius) => {
            this._myCircle && this._myCircle.setNativeProps({ r: circleRadius.value.toString() });
        });


        this.state.fillValue.addListener(() => {
            const { fill } = this.props;
            const { fillValue } = this.state;
            const color = fillValue.interpolate({
                inputRange: [0, 1],
                outputRange: ['#ff000090', 'white']
            });
            this._myCircle.setNativeProps({
                fill: extractBrush(color.__getAnimatedValue())
                // stroke: extractBrush(color.__getAnimatedValue()),
                // strokeWidth: opac.__getAnimatedValue().toString()
            });
        });


        setTimeout(() => {
            Animated.spring(this.state.circleRadius, {
                toValue: this.props.r * 1,
                friction: 3,
                useNativeDriver: true
            }).start();
        }, 2000);

    }

    setNativeProps = (props) => {
        this._myCircle.setNativeProps(props);
        this.animateMyCircle();
    };

    animateMyCircle = () => {
        Animated.sequence([
            Animated.parallel([
                Animated.timing(this.state.circleRadius, {
                    toValue: (this.props.r * 2),
                    easing: Easing.bounce,
                    useNativeDriver: true
                }),
                Animated.timing(this.state.fillValue, {
                    toValue: 0,
                    useNativeDriver:true
                    // duration: 500,
                    // easing: Easing.bounce
                })
            ]),
            // Animated.delay(400),
            Animated.parallel([
                Animated.timing(this.state.circleRadius, {
                    toValue: (this.props.r),
                    easing: Easing.bounce,
                    useNativeDriver:true
                }),
                Animated.timing(this.state.fillValue, {
                    toValue: 1,
                    useNativeDriver:true
                    // duration: 500,
                    // easing: Easing.bounce
                })
            ])

        ]).start(({ finished }) => {
            if (finished) {
                // this.state.fillValue.setValue(0);
            }
        });
    };

    render() {
        return (
            <AnimatedCircle ref={ref => this._myCircle = ref} {...this.props}
                // fill='white' stroke="orange" strokeWidth={2}
                // onPress={() => this.animateMyCircle()}
            />
        );
    }
}