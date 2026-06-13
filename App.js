// React para crear componentes y useState para manejar estados
import React, { useState } from "react";

// Componentes principales de React Native
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ScrollView} from "react-native";

// Navegación
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Formularios y validaciones
import { Formik } from "formik";
import * as Yup from "yup";

// Firebase
import { doc, getDoc } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "./firebaseConfig";

// Pantallas
import HomeScreen from "./screens/HomeScreen";
import RegistroScreen from "./screens/RegistroScreen";
import HistorialScreen from "./screens/HistorialScreen";
import DetalleScreen from "./screens/DetalleScreen";
import RegisterScreen from "./screens/RegisterScreen";
import MaterialRecibidoScreen from "./screens/MaterialRecibidoScreen";
import MaterialEnviadoScreen from "./screens/MaterialEnviadoScreen";
import RegistroMoliendaScreen from "./screens/RegistroMoliendaScreen";
import RegistroCarbonActivadoScreen from "./screens/RegistroCarbonActivadoScreen";
import RegistroCarbonDesactivadoScreen from "./screens/RegistroCarbonDesactivadoScreen";
import RegistroRelaveScreen from "./screens/RegistroRelaveScreen";
import HistorialMaterialesScreen from "./screens/HistorialMaterialesScreen";
import DetalleMaterialScreen from "./screens/DetalleMaterialScreen";

const Stack = createNativeStackNavigator();

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Correo inválido")
    .required("El correo es obligatorio"),

  password: Yup.string()
    .min(6, "Mínimo 6 caracteres")
    .required("La contraseña es obligatoria"),
});

const LoginScreen = ({ navigation }) => {
  const [focusedField, setFocusedField] = useState(null);

  const inputStyle = (field) => [
    styles.input,
    focusedField === field && styles.inputFocused,
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.card}>
        <Image source={require("./assets/icon/bza.png")} style={styles.logo} />

        <Text style={styles.title}>Bitácora CCTV</Text>
        <Text style={styles.company}>Bonanza</Text>
        <Text style={styles.subtitle}>Registro y Control Operativo</Text>

        <View style={styles.divider} />

        <Text style={styles.loginText}>Inicio de sesión</Text>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={async (values) => {
            try {
              const userCredential = await signInWithEmailAndPassword(
                auth,
                values.email,
                values.password
              );

              const userDoc = await getDoc(
                doc(db, "usuarios", userCredential.user.uid)
              );

              const nombre = userDoc.exists()
                ? userDoc.data().nombre
                : values.email;

              Alert.alert("Bienvenido", nombre);

              navigation.navigate("Home", {
                nombre: nombre,
              });
            } catch (error) {
              Alert.alert("Error", "Correo o contraseña incorrectos");
              console.log(error);
            }
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <>
              <Text style={styles.label}>Correo electrónico</Text>
              <TextInput
                style={inputStyle("email")}
                placeholder="Ingrese su correo"
                placeholderTextColor="#94a3b8"
                value={values.email}
                onChangeText={handleChange("email")}
                onFocus={() => setFocusedField("email")}
                onBlur={(e) => {
                  handleBlur("email")(e);
                  setFocusedField(null);
                }}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              {touched.email && errors.email && (
                <Text style={styles.error}>{errors.email}</Text>
              )}

              <Text style={styles.label}>Contraseña</Text>
              <TextInput
                style={inputStyle("password")}
                placeholder="Ingrese su contraseña"
                placeholderTextColor="#94a3b8"
                value={values.password}
                onChangeText={handleChange("password")}
                onFocus={() => setFocusedField("password")}
                onBlur={(e) => {
                  handleBlur("password")(e);
                  setFocusedField(null);
                }}
                autoCapitalize="none"
                secureTextEntry
              />
              {touched.password && errors.password && (
                <Text style={styles.error}>{errors.password}</Text>
              )}

              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Iniciar sesión</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.registerButton}
                onPress={() => navigation.navigate("Register")}
              >
                <Text style={styles.registerButtonText}>Crear cuenta</Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Registro" component={RegistroScreen} />
        <Stack.Screen name="Historial" component={HistorialScreen} />
        <Stack.Screen name="Detalle" component={DetalleScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="MaterialRecibido" component={MaterialRecibidoScreen} />
        <Stack.Screen name="MaterialEnviado" component={MaterialEnviadoScreen} />
        <Stack.Screen name="RegistroMolienda" component={RegistroMoliendaScreen} />
        <Stack.Screen name="RegistroCarbonActivado" component={RegistroCarbonActivadoScreen} />
        <Stack.Screen name="RegistroCarbonDesactivado" component={RegistroCarbonDesactivadoScreen} />
        <Stack.Screen name="RegistroRelave" component={RegistroRelaveScreen} />
        <Stack.Screen name="HistorialMateriales" component={HistorialMaterialesScreen} />
        <Stack.Screen name="DetalleMaterial" component={DetalleMaterialScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },

  contentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    paddingBottom: 50,
  },

  card: {
    backgroundColor: "#ffffff",
    padding: 25,
    borderRadius: 24,
    elevation: 8,
  },

  logo: {
    width: 155,
    height: 155,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 8,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#0f172a",
    textAlign: "center",
  },

  company: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2563eb",
    textAlign: "center",
    marginTop: 2,
  },

  subtitle: {
    fontSize: 15,
    color: "#64748b",
    textAlign: "center",
    marginTop: 6,
  },

  divider: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginVertical: 20,
  },

  loginText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 8,
  },

  label: {
    fontSize: 14,
    color: "#334155",
    marginBottom: 6,
    marginTop: 12,
    fontWeight: "600",
  },

  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 12,
    padding: 13,
    fontSize: 16,
    color: "#0f172a",
    backgroundColor: "#f8fafc",
  },

  inputFocused: {
    borderColor: "#2563eb",
    backgroundColor: "#ffffff",
  },

  error: {
    color: "#dc2626",
    fontSize: 13,
    marginTop: 4,
    fontWeight: "500",
  },

  button: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 12,
    marginTop: 25,
    elevation: 3,
  },

  buttonText: {
    color: "#ffffff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },

  registerButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#2563eb",
    padding: 15,
    borderRadius: 12,
    marginTop: 12,
  },

  registerButtonText: {
    color: "#2563eb",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});