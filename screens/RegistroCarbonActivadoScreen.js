import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Share, Vibration, Image} from "react-native";

import * as ImagePicker from "expo-image-picker";
import * as Sharing from "expo-sharing";
import { Formik } from "formik";
import * as Yup from "yup";

import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const placas = ["GTH-8854", "GSN-3402", "GSM-1424"];

const CarbonSchema = Yup.object().shape({
  material: Yup.string().required("El material es obligatorio"),
  horaLlegada: Yup.string().matches(/^\d{2}h\d{2}$/, "Use el formato correcto. Ej: 13h52").required("La hora es obligatoria"),
  totalBigBags: Yup.string().matches(/^[0-9]+$/, "Solo se permiten números").required("Ingrese el total de Big Bags"),
  vehiculo: Yup.string().required("El vehículo es obligatorio"),
  placa: Yup.string().required("Seleccione la placa"),
  guia: Yup.string().matches(/^[0-9]+$/, "Solo se permiten números").required("La guía es obligatoria"),
  bigBag1Bultos: Yup.string().required("Ingrese bultos del Big Bag #1"),
  bigBag1Origen: Yup.string().required("Ingrese origen del Big Bag #1"),
  bigBag1Precinto: Yup.string().required("Ingrese precinto del Big Bag #1"),
  nota: Yup.string().required("La nota es obligatoria"),
});

const RegistroCarbonActivadoScreen = () => {
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

    const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });

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
    const bigBags = [
      {
        numero: 1,
        bultos: values.bigBag1Bultos,
        origen: values.bigBag1Origen,
        precinto: values.bigBag1Precinto,
      },
      {
        numero: 2,
        bultos: values.bigBag2Bultos,
        origen: values.bigBag2Origen,
        precinto: values.bigBag2Precinto,
      },
      {
        numero: 3,
        bultos: values.bigBag3Bultos,
        origen: values.bigBag3Origen,
        precinto: values.bigBag3Precinto,
      },
      {
        numero: 4,
        bultos: values.bigBag4Bultos,
        origen: values.bigBag4Origen,
        precinto: values.bigBag4Precinto,
      },
    ].filter((item) => item.bultos && item.origen && item.precinto);

    const totalBultos = bigBags.reduce(
      (suma, item) => suma + Number(item.bultos),
      0
    );

    const detalleBigBags = bigBags
      .map(
        (item) => `*BIG BAG #${item.numero}*
• Cargados total de: *${item.bultos}* Bultos / Origen: *${item.origen}* / Código Precinto: *${item.precinto}*`
      )
      .join("\n\n");

    const clasificacion = bigBags
      .map((item) => `• ${item.origen}: *${item.bultos} Bultos*`)
      .join("\n");

    return `*---REPORTE DE MATERIAL RECIBIDO---*

Informe Material Recibido: *${values.material}*

*Hora de llegada a las* *(${values.horaLlegada})* / Se confirma en verificación física el total de *${values.totalBigBags}* Big Bag´s Carbón Activado / Cargado / Traslada – ${values.vehiculo} *(${values.placa})*

CLASIFICACION BIG BAG.-

${detalleBigBags}

Clasificación Bultos:
${clasificacion}

TOTAL: *${totalBultos} Bultos*

${values.procesado} *N° Guía:* ${values.guia}

*Nota:* ${values.nota}`;
  };

  const compartirReporte = (values) => {
    const reporte = construirReporte(values);
    setReporteGenerado(reporte);

    Alert.alert( "Confirmar reporte", "Revise la vista previa antes de compartir. ¿Desea enviar este reporte?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Compartir",
          onPress: async () => {
            Vibration.vibrate(100);
            await Share.share({ message: reporte });
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
      showsVerticalScrollIndicator={false} >

      <Text style={styles.title}>Carbón Activado / Preñado</Text>
      <Text style={styles.subtitle}>Material Recibido</Text>

      <Formik
        initialValues={{
          material: "Carbón Activado LOTE #3 – LOTE #10",
          horaLlegada: "",
          totalBigBags: "",
          vehiculo: "Camión",
          placa: "",
          guia: "",
          procesado:
            "Procesado. - Activado en cianuración por proceso de lixiviación de arenas / Proceso de recepción. – Proceso de remediación",

          bigBag1Bultos: "",
          bigBag1Origen: "",
          bigBag1Precinto: "",

          bigBag2Bultos: "",
          bigBag2Origen: "",
          bigBag2Precinto: "",

          bigBag3Bultos: "",
          bigBag3Origen: "",
          bigBag3Precinto: "",

          bigBag4Bultos: "",
          bigBag4Origen: "",
          bigBag4Precinto: "",

          nota: "Sin novedad",
        }}
        validationSchema={CarbonSchema}
        onSubmit={async (values, { resetForm }) => {
          try {
            const reporte = construirReporte(values);

            await addDoc(collection(db, "materiales"), {
              ...values,
              tipoRegistro: "Material Recibido",
              categoria: "Carbón Activado / Preñado",
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
              <Text style={styles.sectionTitle}>Datos generales</Text>

              <Text style={styles.label}>Informe Material Recibido</Text>
              <TextInput
                style={inputStyle("material")}
                placeholder="Ej: Carbón Activado LOTE #3 – LOTE #10"
                value={values.material}
                onChangeText={handleChange("material")}
                onFocus={() => setFocusedField("material")}
                onBlur={(e) => {
                  handleBlur("material")(e);
                  setFocusedField(null);
                }}
              />
              {touched.material && errors.material && (
                <Text style={styles.error}>{errors.material}</Text>
              )}

              <Text style={styles.label}>Hora de llegada</Text>
              <TextInput
                style={inputStyle("horaLlegada")}
                placeholder="Ej: 10h21"
                value={values.horaLlegada}
                onChangeText={(text) => {
                  const limpio = text.replace(/[^0-9h]/g, "");
                  setFieldValue("horaLlegada", limpio);
                }}
                onFocus={() => setFocusedField("horaLlegada")}
                onBlur={(e) => {
                  handleBlur("horaLlegada")(e);
                  setFocusedField(null);
                }}
              />
              {touched.horaLlegada && errors.horaLlegada && (
                <Text style={styles.error}>{errors.horaLlegada}</Text>
              )}

              <Text style={styles.label}>Total de Big Bags</Text>
              <TextInput
                style={inputStyle("totalBigBags")}
                placeholder="Ej: 4"
                value={values.totalBigBags}
                onChangeText={(text) => {
                  const soloNumeros = text.replace(/[^0-9]/g, "");
                  setFieldValue("totalBigBags", soloNumeros);
                }}
                keyboardType="numeric"
              />
              {touched.totalBigBags && errors.totalBigBags && (
                <Text style={styles.error}>{errors.totalBigBags}</Text>
              )}

              <Text style={styles.label}>Vehículo</Text>
              <TextInput
                style={inputStyle("vehiculo")}
                placeholder="Ej: Camión"
                value={values.vehiculo}
                onChangeText={handleChange("vehiculo")}
              />

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

              <Text style={styles.label}>Número de guía</Text>
              <TextInput
                style={inputStyle("guia")}
                placeholder="Ej: 003-002-000000222"
                value={values.guia}
                onChangeText={(text) => {
                  const soloNumeros = text.replace(/[^0-9-]/g, "");
                  setFieldValue("guia", soloNumeros);
                }}
              />
              {touched.guia && errors.guia && (
                <Text style={styles.error}>{errors.guia}</Text>
              )}

              <Text style={styles.label}>Proceso / Observación</Text>
              <TextInput
                style={[inputStyle("procesado"), styles.textArea]}
                value={values.procesado}
                onChangeText={handleChange("procesado")}
                multiline
              />
            </View>

            {[1, 2, 3, 4].map((num) => (
              <View style={styles.section} key={num}>
                <Text style={styles.sectionTitle}>BIG BAG #{num}</Text>

                <Text style={styles.label}>Cantidad de bultos</Text>
                <TextInput
                  style={inputStyle(`bigBag${num}Bultos`)}
                  placeholder="Ej: 08"
                  value={values[`bigBag${num}Bultos`]}
                  onChangeText={(text) => {
                    const soloNumeros = text.replace(/[^0-9]/g, "");
                    setFieldValue(`bigBag${num}Bultos`, soloNumeros);
                  }}
                  keyboardType="numeric"
                />

                <Text style={styles.label}>Origen / Lote</Text>
                <TextInput
                  style={inputStyle(`bigBag${num}Origen`)}
                  placeholder="Ej: Lote #3"
                  value={values[`bigBag${num}Origen`]}
                  onChangeText={handleChange(`bigBag${num}Origen`)}
                />

                <Text style={styles.label}>Código Precinto</Text>
                <TextInput
                  style={inputStyle(`bigBag${num}Precinto`)}
                  placeholder="Ej: CNPCR-01809"
                  value={values[`bigBag${num}Precinto`]}
                  onChangeText={handleChange(`bigBag${num}Precinto`)}
                  autoCapitalize="characters"
                />
              </View>
            ))}

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Novedad y evidencia</Text>

              <Text style={styles.label}>Nota / Novedad</Text>
              <TextInput
                style={inputStyle("nota")}
                value={values.nota}
                onChangeText={handleChange("nota")}
              />
              {touched.nota && errors.nota && (
                <Text style={styles.error}>{errors.nota}</Text>
              )}

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
              <TouchableOpacity style={styles.shareButton} onPress={() => compartirReporte(values)} >
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

export default RegistroCarbonActivadoScreen;

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

  section: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    elevation: 4,
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
    minHeight: 90,
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