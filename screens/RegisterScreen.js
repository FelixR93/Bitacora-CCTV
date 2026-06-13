import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView} from "react-native";

import { Formik } from "formik";
import * as Yup from "yup";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const RegisterSchema = Yup.object().shape({
  nombre: Yup.string().required("El nombre es obligatorio"),

  email: Yup.string()
    .email("Correo inválido")
    .required("El correo es obligatorio"),

  password: Yup.string()
    .min(6, "Mínimo 6 caracteres")
    .required("La contraseña es obligatoria"),

  confirmarPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Las contraseñas no coinciden")
    .required("Confirme la contraseña"),
});

const RegisterScreen = ({ navigation }) => {
  const [focusedField, setFocusedField] = useState(null);

  const inputStyle = (field) => [
    styles.input,
    focusedField === field && styles.inputFocused,
  ];

  return (
    <ScrollView style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Crear Cuenta</Text>
        <Text style={styles.subtitle}>Bitácora CCTV Bonanza</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Datos del monitorista</Text>

        <Formik
          initialValues={{
            nombre: "",
            email: "",
            password: "",
            confirmarPassword: "",
          }}
          validationSchema={RegisterSchema}
          onSubmit={async (values) => {
            try {
              const userCredential = await createUserWithEmailAndPassword(
                auth,
                values.email,
                values.password
              );

              await setDoc(doc(db, "usuarios", userCredential.user.uid), {
                nombre: values.nombre,
                email: values.email,
              });

              Alert.alert( "Usuario creado", "El monitorista fue registrado correctamente" );

              navigation.navigate("Login");
            } catch (error) {
              Alert.alert("Error", "No se pudo registrar el usuario");
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
              <Text style={styles.label}>Nombre</Text>
              <TextInput
                style={inputStyle("nombre")}
                placeholder="Ingrese su nombre"
                placeholderTextColor="#94a3b8"
                value={values.nombre}
                onChangeText={handleChange("nombre")}
                onFocus={() => setFocusedField("nombre")}
                onBlur={(e) => {
                  handleBlur("nombre")(e);
                  setFocusedField(null);
                }}
              />
              {touched.nombre && errors.nombre && (
                <Text style={styles.error}>{errors.nombre}</Text>
              )}

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

              <Text style={styles.label}>Confirmar contraseña</Text>
              <TextInput
                style={inputStyle("confirmarPassword")}
                placeholder="Repita su contraseña"
                placeholderTextColor="#94a3b8"
                value={values.confirmarPassword}
                onChangeText={handleChange("confirmarPassword")}
                onFocus={() => setFocusedField("confirmarPassword")}
                onBlur={(e) => {
                  handleBlur("confirmarPassword")(e);
                  setFocusedField(null);
                }}
                autoCapitalize="none"
                secureTextEntry
              />
              {touched.confirmarPassword && errors.confirmarPassword && (
                <Text style={styles.error}>{errors.confirmarPassword}</Text>
              )}

              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Registrarse</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate("Login")} >
                <Text style={styles.secondaryButtonText}>Ya tengo cuenta</Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
};

export default RegisterScreen;

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

  header: {
    marginBottom: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 16,
    color: "#cbd5e1",
    textAlign: "center",
    marginTop: 6,
  },

  card: {
    backgroundColor: "#ffffff",
    padding: 24,
    borderRadius: 22,
    elevation: 8,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2563eb",
    marginBottom: 10,
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

  secondaryButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#2563eb",
    padding: 15,
    borderRadius: 12,
    marginTop: 12,
  },

  secondaryButtonText: {
    color: "#2563eb",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});