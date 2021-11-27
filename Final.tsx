import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { getStatusBarHeight } from "react-native-status-bar-height"; 
import { StatusBar } from 'expo-status-bar'
import { FlatList } from 'react-native-gesture-handler';
import AppLoading from 'expo-app-loading';
import _ from 'lodash'


// back키 이슈
// 카테고리 어케 찾냐... 이건 그냥 for
// 이름 같은 음식점 처리...

export default function Final({ navigation, route }) {
  const [isLoaded, setLoad] = useState(false);
  const [data, setData] = useState([]);
  const { finalFood } = route.params;
  const { categoryList } = route.params;
  const { arrC } = route.params;
  const { arrF } = route.params;

  function range(start: number, end: number) {
    let array = [];
    for (let i = start; i < end; ++i) {
      array.push(i);
    }
    return array;
  }

  /*
  const findSameRest = (tempArr: Array<Object>) => {
    //let newJSON = ( ({ "address", "contact", "inHanyang", "name" }) => ({ "address", "contact", "inHanyang", "name" }) )(WhatToDo[0]);
    //let newJSON = _.pick(WhatToDo[0], ['address', 'name'])
    // column 줄이기
    let newArr = tempArr.map(element => _.pick(element, ['address', 'contact', 'name']));
    console.log(`findSameRest2: ${JSON.stringify(newArr)}`);


    let uniqueArr: Array<Object> = [];
    let notUniqueArr: Array<Object> = [];
    newArr.forEach((element) => {
      if (!uniqueArr.includes(element)) {
          uniqueArr.push(element);
      } else {
        notUniqueArr.push(element);
      }
    });
    console.log(uniqueArr.length)
    console.log(notUniqueArr.length)
  }*/

  const findCategory = () => {
    const index = arrF.indexOf(finalFood.name);

    for (const i of range(0, arrC.length)) {
      if (index < arrC[i]) {
        return categoryList[i];
      }
    }
    
  }
  
  const numberWithCommas = (x: any) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const asyncFunc = (Category: string) => {
    let promise = fetch(
      //'https://4h5fvtcuw1.execute-api.ap-northeast-2.amazonaws.com/prod/categories/한식/곱창')
      `https://4h5fvtcuw1.execute-api.ap-northeast-2.amazonaws.com/prod/categories/${Category}/${finalFood.name}`)
        .then(res => res.json())
    return promise;
  }

  const loadAssets = async () => {
    console.log(arrC)
    console.log(arrF)
    console.log(categoryList)
    let Category = findCategory() 
    console.log(`Category: ${Category}, Food: ${finalFood.name}`)
    try {
      const result = await asyncFunc(Category);
      
      //console.log(result.result);
      
      console.log(result.result);
      //findSameRest(result.result)
      setData(result.result);
      
    } catch (err) {
      console.log(err);
    }
  }

  if ( !isLoaded ) {
    return(
      <AppLoading
        startAsync={loadAssets}
        onFinish={() => setLoad(true)}
        onError={console.warn}
      />
    );
  }

  
  else {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor='white' />
        <View style={styles.header}>
          <Text style={[styles.font, {fontSize: 45, textAlign: 'right', paddingRight: 35}]}>메뉴월드컵</Text>
          <Text style={[styles.font, {color: '#898C8E', fontSize: 55}]}>오늘은 안 땡겨!</Text>
        </View>
        <View style={styles.body}>
          <FlatList
            keyExtractor = {item => item.name}
            data={data}
            renderItem={({item, index}) => {
              let textBoxStyle = styles.textBox;
              if (index === 0) {
                textBoxStyle = styles.textBox1;
              } else if (index === (data.length -1)) {
                textBoxStyle = styles.textBox2;
              } else {
                textBoxStyle = styles.textBox3;     
              }
              return (
                <View style={textBoxStyle}>
                  <View style={{flex: 9, backgroundColor: 'white'}}>
                    <Text style={[styles.font, {alignSelf: 'flex-start', paddingLeft: 20, letterSpacing: -2, paddingBottom: 10}]}>{item.name}</Text>
                    <Text style={[styles.font, {color: '#898C8E', fontSize: 15, letterSpacing: -2, alignSelf: 'flex-start', paddingLeft: 5}]}>{item.address}</Text>
                    <Text style={[styles.font, {color: '#898C8E', fontSize: 15, letterSpacing: -2}]}>{item.contact}</Text>
                  </View>
                  <View style={{flex: 5}}>
                    {(item.Foods).map((food: any, index: any) => (
                      <Food food={food} key={index} />
                    ))}  
                  </View>
                </View>
              )
            }}
          />
        </View>
        <View style={styles.tail}>
          <TouchableOpacity onPress={() => navigation.navigate('PickCategory')}> 
            <Text style={[styles.textOnPicture, {color: 'black', fontSize: 15, letterSpacing: -2}]}>다시 카테고리 담기</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Image source={require('./assets/icon/home.png')} style={styles.image}/>
          </TouchableOpacity>
        </View>

      </View>
    )
  }
}

function Food( {food}: any ) {
  return (
    <View>
      <Text style={[styles.font, {color: '#898C8E', fontSize: 15, letterSpacing: -2}]}>{`${food.name} ${food.price}원`}</Text>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: getStatusBarHeight(),
  },
  header: {
    flex: 6,
  },
  font: {
    fontFamily: 'MaruBuri-Regular',
    fontSize: 25,
    color: '#0E4A84',
    letterSpacing: -5,
    textAlign: 'center',
  },
  body: {
    flex: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  textBox: {
    flex: 1,
    width: 380,
    height: 140,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#A5A5A5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  textBox1: {
    flex: 1,
    width: 380,
    height: 140,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#A5A5A5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',

    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomWidth: 0.5
  },
  textBox2: {
    flex: 1,
    width: 380,
    height: 140,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#A5A5A5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',

    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderTopWidth: 0.5
  },
  textBox3: {
    flex: 1,
    width: 380,
    height: 140,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#A5A5A5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',

    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
  },
  tail: {
    flex: 1.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  image: {
    width: 50,
    height: 50,
    backgroundColor: '#f5f5f5',
  },
  textOnPicture: {
    fontFamily: 'MaruBuri-Regular',
    color: "black",
    fontSize: 35,
    textAlign: "center",
    letterSpacing: -2,
  },
})