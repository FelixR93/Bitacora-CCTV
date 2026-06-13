import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";

import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

import { Formik } from "formik";
import * as Yup from "yup";

const RegistroSchema = Yup.object().shape({
  area: Yup.string().required("El área es obligatoria"),
  camara: Yup.string().required("La cámara es obligatoria"),
  tipo: Yup.string().required("El tipo de novedad es obligatorio"),
  prioridad: Yup.string().required("La prioridad es obligatoria"),
  descripcion: Yup.string().required("La descripción es obligatoria"),
});

const RegistroScreen = ({ navigation }) => {
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
      <Text style={styles.title}>Registrar Novedad</Text>
      <Text style={styles.subtitle}>Bitácora CCTV Bonanza</Text>

      <View style={styles.card}>
        <Formik
          initialValues={{
            area: "",
            camara: "",
            tipo: "",
            prioridad: "",
            descripcion: "",
          }}
          validationSchema={RegistroSchema}
          onSubmit={async (values, { resetForm }) => {
            try {
              const nuevaNovedad = {
                area: values.area,
                camara: values.camara,
                tipo: values.tipo,
                prioridad: values.prioridad,
                descripcion: values.descripcion,
                fecha: new Date().toLocaleDateString(),
                hora: new Date().toLocaleTimeString(),
                fechaRegistro: new Date(),
              };

              await addDoc(collection(db, "novedades"), nuevaNovedad);

              Alert.alert(
                "Registro exitoso",
                "La novedad fue guardada correctamente"
              );

              resetForm();
              navigation.navigate("Home");
            } catch (error) {
              Alert.alert("Error", "No se pudo guardar la novedad");
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
              <Text style={styles.sectionTitle}>Datos de la novedad</Text>

              <Text style={styles.label}>Área</Text>
              <TextInput
                style={inputStyle("area")}
                placeholder="Ej: Garita principal"
                placeholderTextColor="#94a3b8"
                value={values.area}
                onChangeText={handleChange("area")}
                onFocus={() => setFocusedField("area")}
                onBlur={(e) => {
                  handleBlur("area")(e);
                  setFocusedField(null);
                }}
              />
              {touched.area && errors.area && (
                <Text style={styles.error}>{errors.area}</Text>
              )}

              <Text style={styles.label}>Cámara</Text>
              <TextInput
                style={inputStyle("camara")}
                placeholder="Ej: CAM-01"
                placeholderTextColor="#94a3b8"
                value={values.camara}
                onChangeText={handleChange("camara")}
                onFocus={() => setFocusedField("camara")}
                onBlur={(e) => {
                  handleBlur("camara")(e);
                  setFocusedField(null);
                }}
                autoCapitalize="characters"
              />
              {touched.camara && errors.camara && (
                <Text style={styles.error}>{errors.camara}</Text>
              )}

              <Text style={styles.label}>Tipo de novedad</Text>
              <TextInput
                style={inputStyle("tipo")}
                placeholder="Ej: Ingreso no autorizado"
                placeholderTextColor="#94a3b8"
                value={values.tipo}
                onChangeText={handleChange("tipo")}
                onFocus={() => setFocusedField("tipo")}
                onBlur={(e) => {
                  handleBlur("tipo")(e);
                  setFocusedField(null);
                }}
              />
              {touched.tipo && errors.tipo && (
                <Text style={styles.error}>{errors.tipo}</Text>
              )}

              <Text style={styles.label}>Prioridad</Text>
              <TextInput
                style={inputStyle("prioridad")}
                placeholder="Baja / Media / Alta"
                placeholderTextColor="#94a3b8"
                value={values.prioridad}
                onChangeText={handleChange("prioridad")}
                onFocus={() => setFocusedField("prioridad")}
                onBlur={(e) => {
                  handleBlur("prioridad")(e);
                  setFocusedField(null);
                }}
              />
              {touched.prioridad && errors.prioridad && (
                <Text style={styles.error}>{errors.prioridad}</Text>
              )}

              <Text style={styles.label}>Descripción</Text>
              <TextInput
                style={[inputStyle("descripcion"), styles.textArea]}
                placeholder="Describa la novedad observada"
                placeholderTextColor="#94a3b8"
                value={values.descripcion}
                onChangeText={handleChange("descripcion")}
                onFocus={() => setFocusedField("descripcion")}
                onBlur={(e) => {
                  handleBlur("descripcion")(e);
                  setFocusedField(null);
                }}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              {touched.descripcion && errors.descripcion && (
                <Text style={styles.error}>{errors.descripcion}</Text>
              )}

              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Guardar Novedad</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.secondaryButtonText}>Volver</Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
};

export default RegistroScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  contentContainer: {
    padding: 20,
    paddingBottom: 60,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0f172a",
    textAlign: "center",
    marginTop: 20,
  },

  subtitle: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 25,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 22,
    elevation: 6,
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

  textArea: {
    minHeight: 100,
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