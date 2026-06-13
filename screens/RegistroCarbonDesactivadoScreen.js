import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Share, Vibration, Image} from "react-native";

import * as ImagePicker from "expo-image-picker";
import * as Sharing from "expo-sharing";
import { Formik } from "formik";
import * as Yup from "yup";

import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const placas = ["GTH-8854", "GSN-3402"];

const CarbonDesactivadoSchema = Yup.object().shape({
  horaSalida: Yup.string().required("La hora de salida es obligatoria"),
  origen: Yup.string().required("El origen es obligatorio"),
  destino: Yup.string().required("El destino es obligatorio"),
  vehiculo: Yup.string().required("El vehículo es obligatorio"),
  placa: Yup.string().required("Seleccione la placa"),
  cantidadBultos: Yup.string().required("La cantidad de bultos es obligatoria"),
  guia: Yup.string().required("La guía es obligatoria"),
  observacion: Yup.string().required("La observación es obligatoria"),
  novedad: Yup.string().required("La novedad es obligatoria"),
});

const RegistroCarbonDesactivadoScreen = () => {
  const [focusedField, setFocusedField] = useState(null);
  const [fotoGuia, setFotoGuia] = useState(null);
  const [reporteGenerado, setReporteGenerado] = useState("");

  const inputStyle = (field) => [
    styles.input,
    focusedField === field && styles.inputFocused,
  ];

  const tomarFoto = async () => {
    const permiso = await ImagePicker.requestCameraPermissionsAsync();

    if (!permiso.granted) {
      Alert.alert("Permiso requerido", "Debe permitir el uso de la cámara");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
    });

    if (!result.canceled) {
      setFotoGuia(result.assets[0].uri);
    }
  };

  const subirFoto = async () => {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permiso.granted) {
      Alert.alert("Permiso requerido", "Debe permitir acceso a la galería");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setFotoGuia(result.assets[0].uri);
    }
  };

  const construirReporte = (values) => {
    return `_*--------REPORTE DE MATERIAL ENVIADO--------*_

*Informe de Material Enviado: (Carbón Desactivado Bza)*

*1.-* Se envía de *${values.origen}* a las *(${values.horaSalida})* en el *${values.vehiculo} (${values.placa})* el total de *${values.cantidadBultos} Bultos* de carbón desactivado.

${values.observacion}

Destino. - *${values.destino}*

Guía emitida *(#${values.guia})*

*Novedad:* ${values.novedad}.`;
  };

  const compartirReporte = (values) => {
    const reporte = construirReporte(values);
    setReporteGenerado(reporte);

    Alert.alert(
      "Confirmar reporte", "Revise la vista previa antes de compartir. ¿Desea enviar este reporte?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Compartir",
          onPress: async () => {
            Vibration.vibrate(100);

            await Share.share({
              message: reporte,
            });
          },
        },
      ]
    );
  };

  const compartirGuia = async () => {
    if (!fotoGuia) {
      Alert.alert("Aviso", "Primero debe tomar o subir la foto de la guía");
      return;
    }

    const disponible = await Sharing.isAvailableAsync();

    if (!disponible) {
      Alert.alert("Error", "La opción de compartir no está disponible");
      return;
    }

    Vibration.vibrate(100);

    await Sharing.shareAsync(fotoGuia, {
      mimeType: "image/jpeg",
      dialogTitle: "Compartir foto de guía",
    });
  };

  return (
    <ScrollView style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Carbón Desactivado</Text>
      <Text style={styles.subtitle}>Material Enviado</Text>

      <Formik
        initialValues={{
          horaSalida: "",
          origen: "Bonanza",
          destino: "Rumicuri",
          vehiculo: "Camión",
          placa: "",
          cantidadBultos: "",
          guia: "",
          observacion:
            "Proceso de recepción. - Para cargado de mineral en Tanques de Cianuración.",
          novedad: "Sin novedad",
        }}
        validationSchema={CarbonDesactivadoSchema}
        onSubmit={async (values, { resetForm }) => {
          try {
            const reporte = construirReporte(values);

            await addDoc(collection(db, "materiales"), {
              ...values,
              tipoRegistro: "Material Enviado",
              categoria: "Carbón Desactivado",
              reporte,
              fotoGuia,
              fechaRegistro: new Date().toLocaleDateString(),
              horaRegistro: new Date().toLocaleTimeString(),
              timestamp: Date.now(),
            });

            setReporteGenerado(reporte);

            Alert.alert("Registro exitoso", "El reporte fue guardado");
            resetForm();
            setFotoGuia(null);
          } catch (error) {
            Alert.alert("Error", "No se pudo guardar el reporte");
            console.log(error);
          }
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          values,
          errors,
          touched,
        }) => (
          <>
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Datos del envío</Text>

              <Text style={styles.label}>Hora de salida</Text>
              <TextInput
                style={inputStyle("horaSalida")}
                placeholder="Ej: 07h32"
                placeholderTextColor="#94a3b8"
                value={values.horaSalida}
                onChangeText={handleChange("horaSalida")}
                onFocus={() => setFocusedField("horaSalida")}
                onBlur={(e) => {
                  handleBlur("horaSalida")(e);
                  setFocusedField(null);
                }}
              />
              {touched.horaSalida && errors.horaSalida && (
                <Text style={styles.error}>{errors.horaSalida}</Text>
              )}

              <Text style={styles.label}>Origen</Text>
              <TextInput
                style={inputStyle("origen")}
                placeholder="Ej: Bonanza"
                placeholderTextColor="#94a3b8"
                value={values.origen}
                onChangeText={handleChange("origen")}
                onFocus={() => setFocusedField("origen")}
                onBlur={(e) => {
                  handleBlur("origen")(e);
                  setFocusedField(null);
                }}
              />
              {touched.origen && errors.origen && (
                <Text style={styles.error}>{errors.origen}</Text>
              )}

              <Text style={styles.label}>Destino</Text>
              <TextInput
                style={inputStyle("destino")}
                placeholder="Ej: Rumicuri"
                placeholderTextColor="#94a3b8"
                value={values.destino}
                onChangeText={handleChange("destino")}
                onFocus={() => setFocusedField("destino")}
                onBlur={(e) => {
                  handleBlur("destino")(e);
                  setFocusedField(null);
                }}
              />
              {touched.destino && errors.destino && (
                <Text style={styles.error}>{errors.destino}</Text>
              )}

              <Text style={styles.label}>Vehículo</Text>
              <TextInput
                style={inputStyle("vehiculo")}
                placeholder="Ej: Camión"
                placeholderTextColor="#94a3b8"
                value={values.vehiculo}
                onChangeText={handleChange("vehiculo")}
                onFocus={() => setFocusedField("vehiculo")}
                onBlur={(e) => {
                  handleBlur("vehiculo")(e);
                  setFocusedField(null);
                }}
              />
              {touched.vehiculo && errors.vehiculo && (
                <Text style={styles.error}>{errors.vehiculo}</Text>
              )}

              <Text style={styles.label}>Seleccione la placa</Text>
              <View style={styles.plateGroup}>
                {placas.map((placa) => (
                  <TouchableOpacity
                    key={placa}
                    style={[
                      styles.plateButton,
                      values.placa === placa && styles.plateButtonActive,
                    ]}
                    onPress={() => setFieldValue("placa", placa)}
                  >
                    <Text
                      style={[
                        styles.plateText,
                        values.placa === placa && styles.plateTextActive,
                      ]}
                    >
                      {placa}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {touched.placa && errors.placa && (
                <Text style={styles.error}>{errors.placa}</Text>
              )}

              <Text style={styles.label}>Cantidad de bultos</Text>
              <TextInput
                style={inputStyle("cantidadBultos")}
                placeholder="Ej: 34"
                placeholderTextColor="#94a3b8"
                value={values.cantidadBultos}
                onChangeText={handleChange("cantidadBultos")}
                onFocus={() => setFocusedField("cantidadBultos")}
                onBlur={(e) => {
                  handleBlur("cantidadBultos")(e);
                  setFocusedField(null);
                }}
                keyboardType="numeric"
              />
              {touched.cantidadBultos && errors.cantidadBultos && (
                <Text style={styles.error}>{errors.cantidadBultos}</Text>
              )}

              <Text style={styles.label}>Número de guía</Text>
              <TextInput
                style={inputStyle("guia")}
                placeholder="Ej: 00008854"
                placeholderTextColor="#94a3b8"
                value={values.guia}
                onChangeText={handleChange("guia")}
                onFocus={() => setFocusedField("guia")}
                onBlur={(e) => {
                  handleBlur("guia")(e);
                  setFocusedField(null);
                }}
              />
              {touched.guia && errors.guia && (
                <Text style={styles.error}>{errors.guia}</Text>
              )}

              <Text style={styles.label}>Proceso / Observación</Text>
              <TextInput
                style={[inputStyle("observacion"), styles.textArea]}
                placeholder="Ingrese la observación del proceso"
                placeholderTextColor="#94a3b8"
                value={values.observacion}
                onChangeText={handleChange("observacion")}
                onFocus={() => setFocusedField("observacion")}
                onBlur={(e) => {
                  handleBlur("observacion")(e);
                  setFocusedField(null);
                }}
                multiline
              />
              {touched.observacion && errors.observacion && (
                <Text style={styles.error}>{errors.observacion}</Text>
              )}

              <Text style={styles.label}>Novedad</Text>
              <TextInput
                style={inputStyle("novedad")}
                placeholder="Ej: Sin novedad"
                placeholderTextColor="#94a3b8"
                value={values.novedad}
                onChangeText={handleChange("novedad")}
                onFocus={() => setFocusedField("novedad")}
                onBlur={(e) => {
                  handleBlur("novedad")(e);
                  setFocusedField(null);
                }}
              />
              {touched.novedad && errors.novedad && (
                <Text style={styles.error}>{errors.novedad}</Text>
              )}
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Evidencia de guía</Text>

              <View style={styles.actionGrid}>
                <TouchableOpacity style={styles.darkAction} onPress={tomarFoto}>
                  <Text style={styles.actionText}>Tomar Foto</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.darkAction} onPress={subirFoto}>
                  <Text style={styles.actionText}>Subir Guía</Text>
                </TouchableOpacity>
              </View>

              {fotoGuia && (
                <Image source={{ uri: fotoGuia }} style={styles.preview} />
              )}
            </View>

            <View style={styles.actionPanel}>
              <TouchableOpacity
                style={styles.shareButton}
                onPress={() => compartirReporte(values)}
              >
                <Text style={styles.buttonText}>Compartir Reporte</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.darkButton} onPress={compartirGuia}>
                <Text style={styles.buttonText}>Compartir Guía</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Guardar Reporte</Text>
              </TouchableOpacity>
            </View>

            {reporteGenerado !== "" && (
              <View style={styles.reportBox}>
                <Text style={styles.reportTitle}>Vista previa del reporte</Text>
                <Text style={styles.reportText}>{reporteGenerado}</Text>
              </View>
            )}
          </>
        )}
      </Formik>
    </ScrollView>
  );
};

export default RegistroCarbonDesactivadoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  contentContainer: {
    padding: 20,
    paddingBottom: 80,
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
    marginTop: 5,
    marginBottom: 22,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    marginBottom: 18,
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
    minHeight: 95,
    textAlignVertical: "top",
  },

  plateGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 4,
  },

  plateButton: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    paddingVertical: 11,
    paddingHorizontal: 13,
    borderRadius: 12,
    marginBottom: 8,
  },

  plateButtonActive: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },

  plateText: {
    color: "#334155",
    fontWeight: "bold",
    fontSize: 14,
  },

  plateTextActive: {
    color: "#ffffff",
  },

  error: {
    color: "#dc2626",
    fontSize: 13,
    marginTop: 4,
    fontWeight: "500",
  },

  actionGrid: {
    flexDirection: "row",
    gap: 12,
    marginTop: 15,
  },

  darkAction: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 15,
    borderRadius: 12,
    elevation: 3,
  },

  actionText: {
    color: "#ffffff",
    textAlign: "center",
    fontSize: 15,
    fontWeight: "bold",
  },

  preview: {
    width: "100%",
    height: 190,
    borderRadius: 14,
    marginTop: 15,
  },

  actionPanel: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 16,
    elevation: 5,
    marginBottom: 18,
  },

  shareButton: {
    backgroundColor: "#16a34a",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },

  darkButton: {
    backgroundColor: "#0f172a",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },

  saveButton: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 12,
  },

  buttonText: {
    color: "#ffffff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },

  reportBox: {
    backgroundColor: "#ffffff",
    padding: 18,
    borderRadius: 18,
    elevation: 4,
    marginBottom: 40,
  },

  reportTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 10,
  },

  reportText: {
    fontSize: 14,
    color: "#334155",
    lineHeight: 22,
  },
});